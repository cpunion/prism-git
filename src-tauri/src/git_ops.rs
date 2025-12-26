use git2::{Repository, StatusOptions};
use crate::models::*;
use std::path::Path;

/// 打开 Git 仓库
pub fn open_repository(path: &str) -> Result<RepoInfo, String> {
    let repo = Repository::open(path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let name = std::path::Path::new(path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("未知仓库")
        .to_string();

    let current_branch = get_current_branch(&repo)?;

    Ok(RepoInfo {
        path: path.to_string(),
        name,
        current_branch,
        is_bare: repo.is_bare(),
    })
}

/// 获取当前分支名称
fn get_current_branch(repo: &Repository) -> Result<String, String> {
    let head = repo.head()
        .map_err(|e| format!("无法获取 HEAD: {}", e))?;

    if let Some(name) = head.shorthand() {
        Ok(name.to_string())
    } else {
        Ok("HEAD".to_string())
    }
}

/// 获取提交历史
pub fn get_commit_history(
    path: &str,
    limit: usize,
    offset: usize,
) -> Result<Vec<CommitInfo>, String> {
    let repo = Repository::open(path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let mut revwalk = repo.revwalk()
        .map_err(|e| format!("无法创建 revwalk: {}", e))?;

    revwalk.set_sorting(git2::Sort::TIME | git2::Sort::TOPOLOGICAL)
        .map_err(|e| format!("设置排序失败: {}", e))?;

    revwalk.push_head()
        .map_err(|e| format!("无法推送 HEAD: {}", e))?;

    let commits: Vec<CommitInfo> = revwalk
        .skip(offset)
        .take(limit)
        .filter_map(|oid_result| {
            let oid = oid_result.ok()?;
            let commit = repo.find_commit(oid).ok()?;

            let parent_ids: Vec<String> = commit.parent_ids()
                .map(|id| id.to_string())
                .collect();

            // 提前提取所有需要的字符串，避免生命周期问题
            let id = commit.id().to_string();
            let short_id = id[..7].to_string();
            let message = commit.message().unwrap_or("").to_string();
            let author = commit.author();
            let author_name = author.name().unwrap_or("").to_string();
            let author_email = author.email().unwrap_or("").to_string();
            let timestamp = commit.time().seconds();

            Some(CommitInfo {
                id,
                short_id,
                message,
                author_name,
                author_email,
                timestamp,
                parent_ids,
            })
        })
        .collect();

    Ok(commits)
}

/// 获取文件状态
pub fn get_file_status(path: &str) -> Result<FileStatusResponse, String> {
    let repo = Repository::open(path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let mut opts = StatusOptions::new();
    opts.include_untracked(true);

    let statuses = repo.statuses(Some(&mut opts))
        .map_err(|e| format!("获取状态失败: {}", e))?;

    let mut unstaged = Vec::new();
    let mut staged = Vec::new();

    for entry in statuses.iter() {
        let file_path = entry.path().unwrap_or("").to_string();
        let status = entry.status();

        let status_str = format_status(status);
        let status_code = format_status_code(status);

        let file_info = FileInfo {
            path: file_path.clone(),
            status: status_str.clone(),
            status_code: status_code.clone(),
        };

        // 已暂存的文件
        if status.intersects(
            git2::Status::INDEX_NEW
            | git2::Status::INDEX_MODIFIED
            | git2::Status::INDEX_DELETED
        ) {
            staged.push(file_info.clone());
        }

        // 未暂存的文件
        if status.intersects(
            git2::Status::WT_NEW
            | git2::Status::WT_MODIFIED
            | git2::Status::WT_DELETED
        ) {
            unstaged.push(file_info);
        }
    }

    Ok(FileStatusResponse { unstaged, staged })
}

/// 格式化 Git 状态为可读文本
fn format_status(status: git2::Status) -> String {
    if status.contains(git2::Status::WT_NEW) || status.contains(git2::Status::INDEX_NEW) {
        "新建".to_string()
    } else if status.contains(git2::Status::WT_MODIFIED) || status.contains(git2::Status::INDEX_MODIFIED) {
        "修改".to_string()
    } else if status.contains(git2::Status::WT_DELETED) || status.contains(git2::Status::INDEX_DELETED) {
        "删除".to_string()
    } else if status.contains(git2::Status::WT_RENAMED) || status.contains(git2::Status::INDEX_RENAMED) {
        "重命名".to_string()
    } else {
        "未知".to_string()
    }
}

/// 格式化状态代码
fn format_status_code(status: git2::Status) -> String {
    if status.contains(git2::Status::WT_NEW) || status.contains(git2::Status::INDEX_NEW) {
        "A".to_string()
    } else if status.contains(git2::Status::WT_MODIFIED) || status.contains(git2::Status::INDEX_MODIFIED) {
        "M".to_string()
    } else if status.contains(git2::Status::WT_DELETED) || status.contains(git2::Status::INDEX_DELETED) {
        "D".to_string()
    } else if status.contains(git2::Status::WT_RENAMED) || status.contains(git2::Status::INDEX_RENAMED) {
        "R".to_string()
    } else {
        "?".to_string()
    }
}

/// 获取文件的 diff
pub fn get_file_diff(path: &str, file_path: &str) -> Result<DiffResponse, String> {
    let repo = Repository::open(path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let head = repo.head()
        .map_err(|e| format!("无法获取 HEAD: {}", e))?;

    let tree = head.peel_to_tree()
        .map_err(|e| format!("无法获取树: {}", e))?;

    let mut diff_opts = git2::DiffOptions::new();
    diff_opts.pathspec(file_path);

    let diff = repo.diff_tree_to_workdir(Some(&tree), Some(&mut diff_opts))
        .map_err(|e| format!("创建 diff 失败: {}", e))?;

    let mut hunks = Vec::new();

    diff.print(git2::DiffFormat::Patch, |_delta, hunk, line| {
        if let Some(hunk) = hunk {
            // 创建新的 hunk
            let diff_hunk = DiffHunk {
                old_start: hunk.old_start(),
                old_lines: hunk.old_lines(),
                new_start: hunk.new_start(),
                new_lines: hunk.new_lines(),
                lines: Vec::new(),
            };
            hunks.push(diff_hunk);
        }

        if !hunks.is_empty() {
            let line_type = match line.origin() {
                '+' => "add",
                '-' => "delete",
                _ => "context",
            };

            let diff_line = DiffLine {
                line_type: line_type.to_string(),
                content: String::from_utf8_lossy(line.content()).to_string(),
                old_lineno: line.old_lineno(),
                new_lineno: line.new_lineno(),
            };

            if let Some(last_hunk) = hunks.last_mut() {
                last_hunk.lines.push(diff_line);
            }
        }

        true
    }).map_err(|e| format!("打印 diff 失败: {}", e))?;

    Ok(DiffResponse {
        file_path: file_path.to_string(),
        hunks,
    })
}

/// Stage a file (add to index)
pub fn stage_file(repo_path: &str, file_path: &str) -> Result<(), String> {
    let repo = Repository::open(repo_path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let mut index = repo.index()
        .map_err(|e| format!("无法获取索引: {}", e))?;

    index.add_path(Path::new(file_path))
        .map_err(|e| format!("添加文件到索引失败: {}", e))?;

    index.write()
        .map_err(|e| format!("写入索引失败: {}", e))?;

    Ok(())
}

/// Unstage a file (remove from index)
pub fn unstage_file(repo_path: &str, file_path: &str) -> Result<(), String> {
    let repo = Repository::open(repo_path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let head = repo.head()
        .map_err(|e| format!("无法获取 HEAD: {}", e))?;

    let head_commit = head.peel_to_commit()
        .map_err(|e| format!("无法获取 HEAD 提交: {}", e))?;

    let head_tree = head_commit.tree()
        .map_err(|e| format!("无法获取树: {}", e))?;

    let mut index = repo.index()
        .map_err(|e| format!("无法获取索引: {}", e))?;

    // Reset the file to HEAD state
    let path = Path::new(file_path);
    index.remove_path(path)
        .map_err(|e| format!("从索引移除文件失败: {}", e))?;

    // Add back from HEAD tree if it exists there
    if let Ok(entry) = head_tree.get_path(path) {
        index.add(&git2::IndexEntry {
            ctime: git2::IndexTime::new(0, 0),
            mtime: git2::IndexTime::new(0, 0),
            dev: 0,
            ino: 0,
            mode: entry.filemode() as u32,
            uid: 0,
            gid: 0,
            file_size: 0,
            id: entry.id(),
            flags: 0,
            flags_extended: 0,
            path: file_path.as_bytes().to_vec(),
        }).map_err(|e| format!("添加文件到索引失败: {}", e))?;
    }

    index.write()
        .map_err(|e| format!("写入索引失败: {}", e))?;

    Ok(())
}

/// Commit staged changes
pub fn commit_changes(repo_path: &str, message: &str) -> Result<String, String> {
    let repo = Repository::open(repo_path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let mut index = repo.index()
        .map_err(|e| format!("无法获取索引: {}", e))?;

    let tree_id = index.write_tree()
        .map_err(|e| format!("写入树失败: {}", e))?;

    let tree = repo.find_tree(tree_id)
        .map_err(|e| format!("查找树失败: {}", e))?;

    let head = repo.head()
        .map_err(|e| format!("无法获取 HEAD: {}", e))?;

    let parent_commit = head.peel_to_commit()
        .map_err(|e| format!("无法获取父提交: {}", e))?;

    let sig = repo.signature()
        .map_err(|e| format!("无法创建签名: {}", e))?;

    let commit_id = repo.commit(
        Some("HEAD"),
        &sig,
        &sig,
        message,
        &tree,
        &[&parent_commit],
    ).map_err(|e| format!("创建提交失败: {}", e))?;

    Ok(commit_id.to_string())
}

/// Get files changed in a specific commit
pub fn get_commit_changes(repo_path: &str, commit_id: &str) -> Result<Vec<FileInfo>, String> {
    let repo = Repository::open(repo_path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let commit = repo.find_commit(git2::Oid::from_str(commit_id).map_err(|e| e.to_string())?)
        .map_err(|e| format!("无法找到提交: {}", e))?;

    let commit_tree = commit.tree()
        .map_err(|e| format!("无法获取提交树: {}", e))?;

    let parent_tree = if commit.parent_count() > 0 {
        let parent = commit.parent(0)
            .map_err(|e| format!("无法获取父提交: {}", e))?;
        Some(parent.tree().map_err(|e| format!("无法获取父提交树: {}", e))?)
    } else {
        None
    };

    let diff = repo.diff_tree_to_tree(parent_tree.as_ref(), Some(&commit_tree), None)
        .map_err(|e| format!("创建 diff 失败: {}", e))?;

    let mut files = Vec::new();

    diff.print(git2::DiffFormat::NameStatus, |_delta, _hunk, line| {
        let content = String::from_utf8_lossy(line.content()).trim().to_string();
        // content format: "M\tfile_path" or "A\tfile_path"
        if let Some((status_char, path)) = content.split_once('\t') {
             let status_code = status_char.to_string();
             let status = match status_char {
                 "M" => "Modified",
                 "A" => "Added",
                 "D" => "Deleted",
                 "R" => "Renamed",
                 _ => "Unknown",
             };

             files.push(FileInfo {
                 path: path.to_string(),
                 status: status.to_string(),
                 status_code,
             });
        }
        true
    }).map_err(|e| format!("处理 diff 失败: {}", e))?;

    Ok(files)
}

/// Get diff for a specific file in a commit
pub fn get_commit_file_diff(repo_path: &str, commit_id: &str, file_path: &str) -> Result<DiffResponse, String> {
    let repo = Repository::open(repo_path)
        .map_err(|e| format!("无法打开仓库: {}", e))?;

    let commit = repo.find_commit(git2::Oid::from_str(commit_id).map_err(|e| e.to_string())?)
        .map_err(|e| format!("无法找到提交: {}", e))?;

    let commit_tree = commit.tree()
        .map_err(|e| format!("无法获取提交树: {}", e))?;

    let parent_tree = if commit.parent_count() > 0 {
        let parent = commit.parent(0)
            .map_err(|e| format!("无法获取父提交: {}", e))?;
        Some(parent.tree().map_err(|e| format!("无法获取父提交树: {}", e))?)
    } else {
        None
    };

    let mut diff_opts = git2::DiffOptions::new();
    diff_opts.pathspec(file_path);

    let diff = repo.diff_tree_to_tree(parent_tree.as_ref(), Some(&commit_tree), Some(&mut diff_opts))
        .map_err(|e| format!("创建 diff 失败: {}", e))?;

    let mut hunks = Vec::new();

    diff.print(git2::DiffFormat::Patch, |_delta, hunk, line| {
        if let Some(hunk) = hunk {
            let diff_hunk = DiffHunk {
                old_start: hunk.old_start(),
                old_lines: hunk.old_lines(),
                new_start: hunk.new_start(),
                new_lines: hunk.new_lines(),
                lines: Vec::new(),
            };
            hunks.push(diff_hunk);
        }

        if !hunks.is_empty() {
            let line_type = match line.origin() {
                '+' => "add",
                '-' => "delete",
                _ => "context",
            };

            let diff_line = DiffLine {
                line_type: line_type.to_string(),
                content: String::from_utf8_lossy(line.content()).to_string(),
                old_lineno: line.old_lineno(),
                new_lineno: line.new_lineno(),
            };

            if let Some(last_hunk) = hunks.last_mut() {
                last_hunk.lines.push(diff_line);
            }
        }
        true
    }).map_err(|e| format!("打印 diff 失败: {}", e))?;

    Ok(DiffResponse {
        file_path: file_path.to_string(),
        hunks,
    })
}
