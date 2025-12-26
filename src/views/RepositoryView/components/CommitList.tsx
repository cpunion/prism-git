import './CommitList.css';

interface CommitInfo {
    id: string;
    shortId: string;
    message: string;
    authorName: string;
    timestamp: number;
}

interface CommitListProps {
    repoPath: string;
    selectedCommit: string | null;
    onSelectCommit: (id: string) => void;
}

export function CommitList({ selectedCommit, onSelectCommit }: CommitListProps) {
    // TODO: Fetch commits from backend
    const commits: CommitInfo[] = [
        {
            id: '52ba77ab1234567890',
            shortId: '52ba77ab',
            message: 'feat: add type support for anonymous struct',
            authorName: 'visualfc',
            timestamp: Date.now() / 1000,
        },
        {
            id: 'a9e6e62fb123456789',
            shortId: 'a9e6e62f',
            message: 'fix: clean code and remove unused imports',
            authorName: 'visualfc',
            timestamp: Date.now() / 1000 - 86400,
        },
        {
            id: '4bcd4e3b123456789',
            shortId: '4bcd4e3b',
            message: 'refactor: rename function for clarity',
            authorName: 'visualfc',
            timestamp: Date.now() / 1000 - 86400 * 2,
        },
    ];

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString();
    };

    // Group commits by date
    const groupedCommits = commits.reduce(
        (groups, commit) => {
            const date = formatDate(commit.timestamp);
            if (!groups[date]) groups[date] = [];
            groups[date].push(commit);
            return groups;
        },
        {} as Record<string, CommitInfo[]>
    );

    return (
        <div className="commit-list">
            <div className="commit-list__header">
                <span className="commit-list__title">Commits</span>
                <div className="commit-list__filters">
                    <button className="commit-list__filter-btn">All Branches ▾</button>
                    <input
                        type="text"
                        className="commit-list__search"
                        placeholder="Search commits..."
                    />
                </div>
            </div>

            <div className="commit-list__content">
                {Object.entries(groupedCommits).map(([date, dateCommits]) => (
                    <div key={date} className="commit-group">
                        <div className="commit-group__header">{date}</div>
                        {dateCommits.map((commit) => (
                            <button
                                key={commit.id}
                                className={`commit-item ${selectedCommit === commit.id ? 'commit-item--selected' : ''}`}
                                onClick={() => onSelectCommit(commit.id)}
                            >
                                <div className="commit-item__graph">
                                    <span className="commit-item__dot" />
                                </div>
                                <div className="commit-item__info">
                                    <div className="commit-item__message">{commit.message}</div>
                                    <div className="commit-item__meta">
                                        <span className="commit-item__hash">{commit.shortId}</span>
                                        <span className="commit-item__author">{commit.authorName}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
