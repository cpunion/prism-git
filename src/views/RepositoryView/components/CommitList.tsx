import { useState, useEffect } from 'react';
import { getCommits, getStatus } from '../../../api';
import './CommitList.css';

interface CommitInfo {
    id: string;
    short_id: string;
    message: string;
    author_name: string;
    author_email: string;
    timestamp: number;
}

interface CommitListProps {
    repoPath: string;
    selectedCommit: string | null;
    onSelectCommit: (id: string) => void;
}

export function CommitList({ repoPath, selectedCommit, onSelectCommit }: CommitListProps) {
    const [commits, setCommits] = useState<CommitInfo[]>([]);
    const [hasUncommittedChanges, setHasUncommittedChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch commits and status
    const loadData = async () => {
        try {
            setLoading(true);
            const [commitsData, statusData] = await Promise.all([
                getCommits(repoPath, 50, 0),
                getStatus(repoPath)
            ]);
            setCommits(commitsData);
            setHasUncommittedChanges(statusData.staged.length > 0 || statusData.unstaged.length > 0);
        } catch (error) {
            console.error('Failed to load commits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [repoPath]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
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

    if (loading) {
        return (
            <div className="commit-list">
                <div className="commit-list__loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="commit-list">
            <div className="commit-list__header">
                <span className="commit-list__title">Commits</span>
                <div className="commit-list__filters">
                    <button className="commit-list__filter-btn">All Branches ▾</button>
                </div>
            </div>

            <div className="commit-list__content">
                {/* Uncommitted Changes Row */}
                {hasUncommittedChanges && (
                    <div className="commit-group">
                        <div className="commit-group__header">Changes</div>
                        <button
                            className={`commit-item ${selectedCommit === 'WORKING_COPY' ? 'commit-item--selected' : ''}`}
                            onClick={() => onSelectCommit('WORKING_COPY')}
                        >
                            <div className="commit-item__graph">
                                <span className="commit-item__dot commit-item__dot--dirty" />
                            </div>
                            <div className="commit-item__info">
                                <div className="commit-item__message">Uncommitted Changes</div>
                                <div className="commit-item__meta">
                                    <span className="commit-item__hash">*</span>
                                    <span className="commit-item__author">You</span>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

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
                                        <span className="commit-item__hash">{commit.short_id}</span>
                                        <span className="commit-item__author">{commit.author_name}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
                {commits.length === 0 && !hasUncommittedChanges && !loading && (
                    <div className="commit-list__empty">No commits yet</div>
                )}
            </div>
        </div>
    );
}
