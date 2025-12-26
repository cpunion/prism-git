import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./GitClient.css";

interface RepoInfo {
    path: string;
    name: string;
    current_branch: string;
    is_bare: boolean;
}

interface CommitInfo {
    id: string;
    short_id: string;
    message: string;
    author_name: string;
    author_email: string;
    timestamp: number;
    parent_ids: string[];
}

interface FileInfo {
    path: string;
    status: string;
    status_code: string;
}

interface FileStatusResponse {
    unstaged: FileInfo[];
    staged: FileInfo[];
}

function GitClient() {
    const [repoPath, setRepoPath] = useState("/Users/lijie/source/cpunion/git-client");
    const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
    const [commits, setCommits] = useState<CommitInfo[]>([]);
    const [fileStatus, setFileStatus] = useState<FileStatusResponse | null>(null);
    const [view, setView] = useState<"history" | "files">("files");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    // 打开仓库
    async function openRepository() {
        try {
            const info = await invoke<RepoInfo>("open_repo", { path: repoPath });
            setRepoInfo(info);
            await loadFileStatus();
            await loadCommits();
        } catch (error) {
            console.error("打开仓库失败:", error);
            alert(`打开仓库失败: ${error}`);
        }
    }

    // 加载提交历史
    async function loadCommits() {
        try {
            const commits = await invoke<CommitInfo[]>("get_commits", {
                path: repoPath,
                limit: 100,
                offset: 0,
            });
            setCommits(commits);
        } catch (error) {
            console.error("加载提交历史失败:", error);
        }
    }

    // 加载文件状态
    async function loadFileStatus() {
        try {
            const status = await invoke<FileStatusResponse>("get_status", {
                path: repoPath,
            });
            setFileStatus(status);
        } catch (error) {
            console.error("加载文件状态失败:", error);
        }
    }

    // 格式化时间戳
    function formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("zh-CN");
    }

    return (
        <div className="git-client">
            {/* 工具栏 */}
            <div className="toolbar">
                <div className="toolbar-left">
                    <input
                        type="text"
                        className="repo-path-input"
                        value={repoPath}
                        onChange={(e) => setRepoPath(e.target.value)}
                        placeholder="仓库路径"
                    />
                    <button onClick={openRepository} className="btn-primary">
                        打开仓库
                    </button>
                </div>
                {repoInfo && (
                    <div className="repo-info">
                        <span className="repo-name">{repoInfo.name}</span>
                        <span className="branch-badge">{repoInfo.current_branch}</span>
                    </div>
                )}
            </div>

            <div className="main-container">
                {/* 侧边栏 */}
                <div className="sidebar">
                    <div className="sidebar-section">
                        <h3 className="section-title">工作区</h3>
                        <div
                            className={`sidebar-item ${view === "files" ? "active" : ""}`}
                            onClick={() => setView("files")}
                        >
                            <span className="icon">📄</span>
                            <span>文件状态</span>
                            {fileStatus && (
                                <span className="badge">
                                    {fileStatus.unstaged.length + fileStatus.staged.length}
                                </span>
                            )}
                        </div>
                        <div
                            className={`sidebar-item ${view === "history" ? "active" : ""}`}
                            onClick={() => setView("history")}
                        >
                            <span className="icon">🕐</span>
                            <span>历史</span>
                            {commits.length > 0 && (
                                <span className="badge">{commits.length}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 主内容区 */}
                <div className="content">
                    {!repoInfo ? (
                        <div className="empty-state">
                            <p>👆 请输入仓库路径并点击"打开仓库"</p>
                        </div>
                    ) : view === "files" ? (
                        <div className="file-status-panel">
                            <h2>文件状态</h2>

                            {fileStatus && fileStatus.unstaged.length > 0 && (
                                <div className="file-group">
                                    <h3 className="group-title">
                                        未暂存的文件 ({fileStatus.unstaged.length})
                                    </h3>
                                    <div className="file-list">
                                        {fileStatus.unstaged.map((file) => (
                                            <div
                                                key={file.path}
                                                className={`file-item ${selectedFile === file.path ? "selected" : ""
                                                    }`}
                                                onClick={() => setSelectedFile(file.path)}
                                            >
                                                <span className={`status-badge status-${file.status_code.toLowerCase()}`}>
                                                    {file.status_code}
                                                </span>
                                                <span className="file-path">{file.path}</span>
                                                <span className="file-status-text">{file.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {fileStatus && fileStatus.staged.length > 0 && (
                                <div className="file-group">
                                    <h3 className="group-title">
                                        已暂存的文件 ({fileStatus.staged.length})
                                    </h3>
                                    <div className="file-list">
                                        {fileStatus.staged.map((file) => (
                                            <div
                                                key={file.path}
                                                className={`file-item ${selectedFile === file.path ? "selected" : ""
                                                    }`}
                                                onClick={() => setSelectedFile(file.path)}
                                            >
                                                <span className={`status-badge status-${file.status_code.toLowerCase()}`}>
                                                    {file.status_code}
                                                </span>
                                                <span className="file-path">{file.path}</span>
                                                <span className="file-status-text">{file.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {fileStatus &&
                                fileStatus.unstaged.length === 0 &&
                                fileStatus.staged.length === 0 && (
                                    <div className="empty-state">
                                        <p>✨ 工作区干净</p>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className="commit-history-panel">
                            <h2>提交历史</h2>
                            <div className="commit-list">
                                {commits.map((commit) => (
                                    <div key={commit.id} className="commit-item">
                                        <div className="commit-header">
                                            <span className="commit-id">{commit.short_id}</span>
                                            <span className="commit-author">{commit.author_name}</span>
                                            <span className="commit-date">
                                                {formatTimestamp(commit.timestamp)}
                                            </span>
                                        </div>
                                        <div className="commit-message">{commit.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GitClient;
