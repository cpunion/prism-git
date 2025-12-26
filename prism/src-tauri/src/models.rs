use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RepoInfo {
    pub path: String,
    pub name: String,
    pub current_branch: String,
    pub is_bare: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommitInfo {
    pub id: String,
    pub short_id: String,
    pub message: String,
    pub author_name: String,
    pub author_email: String,
    pub timestamp: i64,
    pub parent_ids: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileInfo {
    pub path: String,
    pub status: String,
    pub status_code: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileStatusResponse {
    pub unstaged: Vec<FileInfo>,
    pub staged: Vec<FileInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiffHunk {
    pub old_start: u32,
    pub old_lines: u32,
    pub new_start: u32,
    pub new_lines: u32,
    pub lines: Vec<DiffLine>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiffLine {
    pub line_type: String, // "add", "delete", "context"
    pub content: String,
    pub old_lineno: Option<u32>,
    pub new_lineno: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiffResponse {
    pub file_path: String,
    pub hunks: Vec<DiffHunk>,
}
