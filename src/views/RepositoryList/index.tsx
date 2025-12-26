import { useState, useEffect, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { RepoIcon } from '../../components/git/RepoIcon';
import { BranchBadge } from '../../components/git/BranchBadge';
import { Button } from '../../components/common/Button';
import { getRepositoryList, addRepository, removeRepository, openRepo, checkIsGitRepo } from '../../api';
import { openRepoWindow } from '../../api/window';
import { open } from '@tauri-apps/plugin-dialog';
import './index.css';

interface Repository {
    id: string;
    name: string;
    path: string;
    currentBranch: string;
    lastOpenedAt?: string;
}

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    repo: Repository | null;
}

export function RepositoryList() {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [filter, setFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'local' | 'remote'>('local');
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        repo: null,
    });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadRepositories();
    }, []);

    // Listen for refresh event from App dialog
    useEffect(() => {
        const unlisten = listen('repo-list-refresh', () => {
            loadRepositories();
        });
        return () => {
            unlisten.then((fn) => fn());
        };
    }, []);

    // Close context menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const loadRepositories = async () => {
        try {
            setLoading(true);
            const repoList = await getRepositoryList();

            const reposWithBranch = await Promise.all(
                repoList.map(async (r) => {
                    try {
                        const info = await openRepo(r.path);
                        return {
                            id: r.id,
                            name: r.name,
                            path: r.path,
                            currentBranch: info.current_branch || 'main',
                            lastOpenedAt: r.last_opened_at || undefined,
                        };
                    } catch {
                        return {
                            id: r.id,
                            name: r.name,
                            path: r.path,
                            currentBranch: 'unknown',
                            lastOpenedAt: r.last_opened_at || undefined,
                        };
                    }
                })
            );

            setRepos(reposWithBranch);
        } catch (error) {
            console.error('Failed to load repositories:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase()) ||
        repo.path.toLowerCase().includes(filter.toLowerCase())
    );

    // Open repo in new window
    const handleOpenRepo = async (repo: Repository) => {
        try {
            await openRepoWindow(repo.path, repo.name);
        } catch (error) {
            console.error('Failed to open repository window:', error);
        }
    };

    const handleSelectRepo = (repo: Repository) => {
        setSelectedId(repo.id);
    };

    const handleContextMenu = (e: React.MouseEvent, repo: Repository) => {
        e.preventDefault();
        setSelectedId(repo.id);
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            repo,
        });
    };

    const handleRemoveRepo = async (repo: Repository) => {
        try {
            await removeRepository(repo.id);
            setContextMenu(prev => ({ ...prev, visible: false }));
            await loadRepositories();
        } catch (error) {
            console.error('Failed to remove repository:', error);
        }
    };

    const handleRevealInFinder = async (repo: Repository) => {
        // Use Tauri shell plugin
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('plugin:shell|open', { path: repo.path });
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const handleCopyPath = (repo: Repository) => {
        navigator.clipboard.writeText(repo.path);
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const handleAddLocal = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: 'Select Repository Folder',
            });

            if (selected) {
                const isGit = await checkIsGitRepo(selected as string);
                if (!isGit) {
                    alert('The selected directory is not a Git repository');
                    return;
                }
                await addRepository(selected as string);
                await loadRepositories();
            }
        } catch (error) {
            console.error('Failed to add repository:', error);
        }
    };

    const handleClone = async () => {
        alert('Clone feature coming soon!');
    };

    // Handle keyboard shortcuts
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (selectedId && e.key === 'Enter') {
            const repo = repos.find(r => r.id === selectedId);
            if (repo) await handleOpenRepo(repo);
        }
        if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
            const repo = repos.find(r => r.id === selectedId);
            if (repo) await handleRemoveRepo(repo);
        }
    };

    return (
        <div className="repo-list" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* 标题栏 */}
            <div className="repo-list__header">
                <h1 className="repo-list__title">Prism</h1>
            </div>

            {/* 工具栏 */}
            <div className="repo-list__toolbar">
                <div className="repo-list__tabs">
                    <button
                        className={`repo-list__tab ${activeTab === 'local' ? 'active' : ''}`}
                        onClick={() => setActiveTab('local')}
                    >
                        Local
                    </button>
                    <button
                        className={`repo-list__tab ${activeTab === 'remote' ? 'active' : ''}`}
                        onClick={() => setActiveTab('remote')}
                    >
                        Remote
                    </button>
                </div>

                <div className="repo-list__actions">
                    <Button variant="secondary" onClick={handleAddLocal}>
                        + Add
                    </Button>
                    <Button variant="primary" onClick={handleClone}>
                        Clone
                    </Button>
                </div>
            </div>

            {/* 搜索框 */}
            <div className="repo-list__search">
                <input
                    type="text"
                    placeholder="Filter repositories"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="repo-list__search-input"
                />
            </div>

            {/* 仓库列表 */}
            <div className="repo-list__content">
                {loading ? (
                    <div className="repo-list__empty">
                        <p>Loading...</p>
                    </div>
                ) : filteredRepos.length === 0 ? (
                    <div className="repo-list__empty">
                        <p>No repositories found</p>
                        <p className="text-secondary">Add a local repository or clone from remote</p>
                    </div>
                ) : (
                    <ul className="repo-list__items">
                        {filteredRepos.map(repo => (
                            <li
                                key={repo.id}
                                className={`repo-list__item ${selectedId === repo.id ? 'selected' : ''}`}
                                onClick={() => handleSelectRepo(repo)}
                                onDoubleClick={() => handleOpenRepo(repo)}
                                onContextMenu={(e) => handleContextMenu(e, repo)}
                            >
                                <RepoIcon size={40} />
                                <div className="repo-list__item-info">
                                    <div className="repo-list__item-name">{repo.name}</div>
                                    <div className="repo-list__item-path">{repo.path}</div>
                                </div>
                                <div className="repo-list__item-meta">
                                    <BranchBadge branch={repo.currentBranch} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu.visible && contextMenu.repo && (
                <div
                    ref={contextMenuRef}
                    className="context-menu"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button
                        className="context-menu__item"
                        onClick={() => handleOpenRepo(contextMenu.repo!)}
                    >
                        Open Repository
                    </button>
                    <button
                        className="context-menu__item"
                        onClick={() => handleRevealInFinder(contextMenu.repo!)}
                    >
                        Reveal in Finder
                    </button>
                    <button
                        className="context-menu__item"
                        onClick={() => handleCopyPath(contextMenu.repo!)}
                    >
                        Copy Path
                    </button>
                    <div className="context-menu__divider" />
                    <button
                        className="context-menu__item context-menu__item--danger"
                        onClick={() => handleRemoveRepo(contextMenu.repo!)}
                    >
                        Remove from List
                    </button>
                </div>
            )}
        </div>
    );
}
