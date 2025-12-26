import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { BranchBadge } from '../../components/git/BranchBadge';
import { FileStatusBadge } from '../../components/git/FileStatusBadge';
import './index.css';

interface CommitInfo {
    id: string;
    shortId: string;
    message: string;
    authorName: string;
    timestamp: number;
}

interface FileInfo {
    path: string;
    status: string;
    statusCode: 'A' | 'M' | 'D' | 'R';
}

interface RepositoryProps {
    path?: string;
    name?: string;
}

export function Repository({ path, name }: RepositoryProps) {
    const location = useLocation();

    // Get path/name from props or location.state
    const repoPath = path || (location.state as any)?.path || '';
    const repoName = name || (location.state as any)?.name || 'Repository';

    const [activeView, setActiveView] = useState<'status' | 'history'>('status');
    const [commits, setCommits] = useState<CommitInfo[]>([]);
    const [stagedFiles, setStagedFiles] = useState<FileInfo[]>([]);
    const [unstagedFiles, setUnstagedFiles] = useState<FileInfo[]>([]);
    const [currentBranch] = useState('main');

    useEffect(() => {
        if (repoPath) {
            loadRepoData();
        }
    }, [repoPath]);

    const loadRepoData = async () => {
        try {
            // 加载提交历史
            const commitData = await invoke<CommitInfo[]>('get_commits', {
                path: repoPath,
                limit: 50,
                offset: 0,
            });
            setCommits(commitData);

            // 加载文件状态
            const statusData = await invoke<{ staged: FileInfo[], unstaged: FileInfo[] }>('get_status', {
                path: repoPath,
            });
            setStagedFiles(statusData.staged);
            setUnstagedFiles(statusData.unstaged);
        } catch (error) {
            console.error('Failed to load repo data:', error);
        }
    };

    const closeWindow = async () => {
        const window = getCurrentWindow();
        await window.close();
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('zh-CN');
    };

    return (
        <div className="repository">
            {/* 顶部工具栏 */}
            <div className="repository__header">
                <div className="repository__header-left">
                    <button className="repository__back-btn" onClick={closeWindow} title="Close window">
                        ✕
                    </button>
                    <span className="repository__name">{repoName}</span>
                    <BranchBadge branch={currentBranch} />
                </div>
                <div className="repository__header-actions">
                    <Button variant="secondary" icon="↓">Pull</Button>
                    <Button variant="secondary" icon="↑">Push</Button>
                    <Button variant="secondary" icon="↻">Fetch</Button>
                    <Button variant="primary">Commit</Button>
                </div>
            </div>

            <div className="repository__main">
                {/* 侧边栏 */}
                <div className="repository__sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-section__title">WORKSPACE</div>
                        <div
                            className={`sidebar-item ${activeView === 'status' ? 'active' : ''}`}
                            onClick={() => setActiveView('status')}
                        >
                            <span className="sidebar-item__icon">📄</span>
                            <span className="sidebar-item__label">File status</span>
                            {(stagedFiles.length + unstagedFiles.length) > 0 && (
                                <Badge count={stagedFiles.length + unstagedFiles.length} />
                            )}
                        </div>
                        <div
                            className={`sidebar-item ${activeView === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveView('history')}
                        >
                            <span className="sidebar-item__icon">🕐</span>
                            <span className="sidebar-item__label">History</span>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section__title">BRANCHES</div>
                        <div className="sidebar-item">
                            <span className="sidebar-item__icon">🌿</span>
                            <span className="sidebar-item__label">main</span>
                        </div>
                    </div>
                </div>

                {/* 主内容区 */}
                <div className="repository__content">
                    {activeView === 'status' ? (
                        <div className="file-status">
                            {unstagedFiles.length > 0 && (
                                <div className="file-group">
                                    <div className="file-group__header">
                                        Unstaged files ({unstagedFiles.length})
                                    </div>
                                    <div className="file-list">
                                        {unstagedFiles.map(file => (
                                            <div key={file.path} className="file-item">
                                                <FileStatusBadge status={file.statusCode} />
                                                <span className="file-item__path">{file.path}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {stagedFiles.length > 0 && (
                                <div className="file-group">
                                    <div className="file-group__header">
                                        Staged files ({stagedFiles.length})
                                    </div>
                                    <div className="file-list">
                                        {stagedFiles.map(file => (
                                            <div key={file.path} className="file-item">
                                                <FileStatusBadge status={file.statusCode} />
                                                <span className="file-item__path">{file.path}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {stagedFiles.length === 0 && unstagedFiles.length === 0 && (
                                <div className="file-status__empty">
                                    <p>✨ Working tree clean</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="commit-history">
                            <div className="commit-list">
                                {commits.map(commit => (
                                    <div key={commit.id} className="commit-item">
                                        <div className="commit-item__graph">
                                            <div className="commit-dot" />
                                        </div>
                                        <div className="commit-item__info">
                                            <div className="commit-item__message">{commit.message}</div>
                                            <div className="commit-item__meta">
                                                <span className="commit-item__id">{commit.shortId}</span>
                                                <span className="commit-item__author">{commit.authorName}</span>
                                                <span className="commit-item__date">{formatDate(commit.timestamp)}</span>
                                            </div>
                                        </div>
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
