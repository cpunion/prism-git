import './Sidebar.css';

type SidebarView = 'file-status' | 'history' | 'search';

interface RepoSidebarProps {
    activeView: SidebarView;
    onViewChange: (view: SidebarView) => void;
    selectedBranch: string | null;
    onBranchSelect: (branch: string) => void;
    showRemoteBranches: boolean;
    onToggleRemoteBranches: () => void;
}

export function RepoSidebar({
    activeView,
    onViewChange,
    selectedBranch,
    onBranchSelect,
    showRemoteBranches,
    onToggleRemoteBranches,
}: RepoSidebarProps) {
    // TODO: Fetch branches from backend
    const branches = ['main', 'develop', 'feature/new-ui'];

    return (
        <div className="repo-sidebar">
            {/* WORKSPACE Section */}
            <div className="sidebar-section">
                <div className="sidebar-section__title">WORKSPACE</div>

                <button
                    className={`sidebar-item ${activeView === 'file-status' ? 'sidebar-item--active' : ''}`}
                    onClick={() => onViewChange('file-status')}
                >
                    <span className="sidebar-item__icon">📄</span>
                    <span className="sidebar-item__label">File Status</span>
                </button>

                <button
                    className={`sidebar-item ${activeView === 'history' ? 'sidebar-item--active' : ''}`}
                    onClick={() => onViewChange('history')}
                >
                    <span className="sidebar-item__icon">🕐</span>
                    <span className="sidebar-item__label">History</span>
                </button>

                <button
                    className={`sidebar-item ${activeView === 'search' ? 'sidebar-item--active' : ''}`}
                    onClick={() => onViewChange('search')}
                >
                    <span className="sidebar-item__icon">🔍</span>
                    <span className="sidebar-item__label">Search</span>
                </button>
            </div>

            {/* BRANCHES Section */}
            <div className="sidebar-section">
                <div className="sidebar-section__title">
                    <span>BRANCHES</span>
                    <button
                        className="sidebar-section__toggle"
                        onClick={onToggleRemoteBranches}
                        title={showRemoteBranches ? 'Hide remote' : 'Show remote'}
                    >
                        {showRemoteBranches ? '−' : '+'}
                    </button>
                </div>

                <div className="sidebar-branches">
                    {branches.map((branch) => (
                        <button
                            key={branch}
                            className={`sidebar-item ${selectedBranch === branch || (!selectedBranch && branch === 'main') ? 'sidebar-item--active' : ''}`}
                            onClick={() => onBranchSelect(branch)}
                        >
                            <span className="sidebar-item__icon">🌿</span>
                            <span className="sidebar-item__label">{branch}</span>
                            {branch === 'main' && <span className="sidebar-item__badge">✓</span>}
                        </button>
                    ))}
                </div>

                {showRemoteBranches && (
                    <div className="sidebar-branches sidebar-branches--remote">
                        <div className="sidebar-item sidebar-item--header">
                            <span className="sidebar-item__icon">☁️</span>
                            <span className="sidebar-item__label">origin</span>
                        </div>
                        {/* Remote branches would go here */}
                    </div>
                )}
            </div>
        </div>
    );
}
