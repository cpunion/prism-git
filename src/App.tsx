import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import {
    getInitialRepoPath,
    initRepository,
    checkIsGitRepo,
    addRepository,
    getRepositoryList
} from './api';
import { openRepoWindow } from './api/window';
import { RepositoryList } from './views/RepositoryList';
import { Repository } from './views/Repository';
import './styles/global.css';

interface PathInfo {
    path: string;
    isGit: boolean;
}

// 对话框组件
function Dialog({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
}: {
    title: string;
    message: React.ReactNode;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog__header">
                    <h2>{title}</h2>
                </div>
                <div className="dialog__content">
                    {message}
                </div>
                <div className="dialog__actions">
                    <button className="button button--secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="button button--primary" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Repository window view - gets path from query params
function RepositoryWindow() {
    const [searchParams] = useSearchParams();
    const path = searchParams.get('path') || '';
    const name = searchParams.get('name') || 'Repository';

    return <Repository path={path} name={name} />;
}

// 主窗口监听器
function AppWithListener() {
    const [dialogState, setDialogState] = useState<{
        type: 'init' | 'addToList' | null;
        path: string;
    }>({ type: null, path: '' });

    // 检查仓库是否在列表中
    const checkInList = async (path: string): Promise<boolean> => {
        try {
            const repos = await getRepositoryList();
            return repos.some(r => r.path === path);
        } catch {
            return false;
        }
    };

    // 处理打开路径 - 在新窗口中打开
    const handleOpenPath = async (path: string, isGit: boolean) => {
        const name = path.split('/').pop() || 'Repository';

        if (!isGit) {
            // 情况 A：不是 Git 仓库，询问是否初始化
            setDialogState({ type: 'init', path });
        } else {
            // 是 Git 仓库
            const inList = await checkInList(path);
            if (inList) {
                // 情况 C：已在列表，直接在新窗口打开
                await openRepoWindow(path, name);
            } else {
                // 情况 B：不在列表，打开新窗口并询问是否加入
                await openRepoWindow(path, name);
                setDialogState({ type: 'addToList', path });
            }
        }
    };

    // 处理初始化确认
    const handleInitConfirm = async () => {
        const { path } = dialogState;
        const name = path.split('/').pop() || 'Repository';
        try {
            await initRepository(path);
            await addRepository(path, name);
            await openRepoWindow(path, name);
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            alert('Failed to initialize repository: ' + error);
        }
        setDialogState({ type: null, path: '' });
    };

    // 处理加入列表确认
    const handleAddToListConfirm = async () => {
        const { path } = dialogState;
        try {
            const name = path.split('/').pop() || 'Repository';
            await addRepository(path, name);
        } catch (error) {
            console.error('Failed to add repository:', error);
        }
        setDialogState({ type: null, path: '' });
    };

    // 处理取消
    const handleCancel = () => {
        setDialogState({ type: null, path: '' });
    };

    useEffect(() => {
        // 检查初始路径（从 CLI 传入）
        const checkInitialPath = async () => {
            try {
                const path = await getInitialRepoPath();
                if (path) {
                    const isGit = await checkIsGitRepo(path);
                    handleOpenPath(path, isGit);
                }
            } catch (error) {
                console.error('Failed to get initial repo path:', error);
            }
        };

        checkInitialPath();

        // 监听来自第二个实例的打开路径事件
        const unlisten = listen<PathInfo>('open-path', (event) => {
            const { path, isGit } = event.payload;
            handleOpenPath(path, isGit);
        });

        return () => {
            unlisten.then(fn => fn());
        };
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<RepositoryList />} />
                <Route path="/repo/window" element={<RepositoryWindow />} />
                <Route path="/repo/:id" element={<Repository />} />
            </Routes>

            {/* 初始化仓库对话框 */}
            {dialogState.type === 'init' && (
                <Dialog
                    title="Not a Git Repository"
                    message={
                        <>
                            <p>The directory <strong>{dialogState.path}</strong> is not a Git repository.</p>
                            <p>Would you like to initialize a new Git repository here?</p>
                        </>
                    }
                    confirmText="Initialize Repository"
                    cancelText="Cancel"
                    onConfirm={handleInitConfirm}
                    onCancel={handleCancel}
                />
            )}

            {/* 加入列表对话框 */}
            {dialogState.type === 'addToList' && (
                <Dialog
                    title="Add to Repository List?"
                    message={
                        <>
                            <p>This repository is not in your list:</p>
                            <p><strong>{dialogState.path}</strong></p>
                            <p>Would you like to add it for quick access?</p>
                        </>
                    }
                    confirmText="Add to List"
                    cancelText="Not Now"
                    onConfirm={handleAddToListConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppWithListener />
        </BrowserRouter>
    );
}

export default App;
