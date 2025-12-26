import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button } from '../../../components/common/Button';
import './Toolbar.css';

interface RepoToolbarProps {
    repoPath: string;
    repoName: string;
}

export function RepoToolbar({ repoName }: RepoToolbarProps) {
    const handleClose = async () => {
        const window = getCurrentWindow();
        await window.close();
    };

    return (
        <div className="repo-toolbar">
            <div className="repo-toolbar__left">
                <button className="repo-toolbar__close" onClick={handleClose} title="Close">
                    ✕
                </button>
                <span className="repo-toolbar__name">{repoName}</span>
            </div>

            <div className="repo-toolbar__actions">
                <Button variant="secondary" icon="📝">
                    Commit
                </Button>
                <Button variant="secondary" icon="↓">
                    Pull
                </Button>
                <Button variant="secondary" icon="↑">
                    Push
                </Button>
                <Button variant="secondary" icon="⟳">
                    Fetch
                </Button>
                <Button variant="secondary" icon="🌿">
                    Branch
                </Button>
                <Button variant="secondary" icon="⑂">
                    Merge
                </Button>
                <Button variant="secondary" icon="📦">
                    Stash
                </Button>
            </div>

            <div className="repo-toolbar__right">
                <button className="repo-toolbar__icon-btn" title="Terminal">
                    💻
                </button>
                <button className="repo-toolbar__icon-btn" title="Finder">
                    📁
                </button>
                <button className="repo-toolbar__icon-btn" title="Settings">
                    ⚙️
                </button>
            </div>
        </div>
    );
}
