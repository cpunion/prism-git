import { useState, useEffect } from 'react';
import { getDiff, getCommitFileDiff } from '../../../api';
import './DiffViewer.css';

interface DiffLine {
    line_type: string;
    old_lineno: number | null;
    new_lineno: number | null;
    content: string;
}

interface DiffViewerProps {
    repoPath: string;
    commitId?: string; // If present, view diff for specific commit
    filePath: string | null;
    viewMode: 'split' | 'unified';
    onViewModeChange: (mode: 'split' | 'unified') => void;
}

export function DiffViewer({ repoPath, commitId, filePath, viewMode, onViewModeChange }: DiffViewerProps) {
    const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch diff when file or commit changes
    useEffect(() => {
        if (!filePath) {
            setDiffLines([]);
            return;
        }

        const loadDiff = async () => {
            try {
                setLoading(true);
                let diff;
                if (commitId) {
                    diff = await getCommitFileDiff(repoPath, commitId, filePath);
                } else {
                    diff = await getDiff(repoPath, filePath);
                }

                // Flatten hunks into lines
                const lines: DiffLine[] = [];
                for (const hunk of diff.hunks || []) {
                    lines.push(...(hunk.lines || []));
                }
                setDiffLines(lines);
            } catch (error) {
                console.error('Failed to load diff:', error);
                setDiffLines([]);
            } finally {
                setLoading(false);
            }
        };

        loadDiff();
    }, [repoPath, filePath, commitId]);

    if (!filePath) {
        return (
            <div className="diff-viewer diff-viewer--empty">
                <div className="diff-viewer__placeholder">
                    <span className="diff-viewer__placeholder-icon">📄</span>
                    <span className="diff-viewer__placeholder-text">Select a file to view changes</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="diff-viewer diff-viewer--empty">
                <div className="diff-viewer__placeholder">
                    <span className="diff-viewer__placeholder-text">Loading diff...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="diff-viewer">
            <div className="diff-viewer__header">
                <div className="diff-viewer__file-path">
                    <span className="diff-viewer__file-icon">📄</span>
                    <span>{filePath}</span>
                </div>
                <div className="diff-viewer__actions">
                    <select
                        className="diff-viewer__mode-select"
                        value={viewMode}
                        onChange={(e) => onViewModeChange(e.target.value as 'split' | 'unified')}
                    >
                        <option value="unified">Unified</option>
                        <option value="split">Split</option>
                    </select>
                </div>
            </div>

            <div className="diff-viewer__content">
                {viewMode === 'unified' ? (
                    <div className="diff-unified">
                        {diffLines.map((line, index) => (
                            <div key={index} className={`diff-line diff-line--${line.line_type}`}>
                                <span className="diff-line__num diff-line__num--old">
                                    {line.old_lineno || ''}
                                </span>
                                <span className="diff-line__num diff-line__num--new">
                                    {line.new_lineno || ''}
                                </span>
                                <span className="diff-line__prefix">
                                    {line.line_type === 'add' ? '+' : line.line_type === 'delete' ? '-' : ' '}
                                </span>
                                <span className="diff-line__content">{line.content}</span>
                            </div>
                        ))}
                        {diffLines.length === 0 && (
                            <div className="diff-viewer__empty">No changes</div>
                        )}
                    </div>
                ) : (
                    <div className="diff-split">
                        <div className="diff-split__side diff-split__side--old">
                            {diffLines
                                .filter((l) => l.line_type !== 'add')
                                .map((line, index) => (
                                    <div key={index} className={`diff-line diff-line--${line.line_type}`}>
                                        <span className="diff-line__num">{line.old_lineno || ''}</span>
                                        <span className="diff-line__content">{line.content}</span>
                                    </div>
                                ))}
                        </div>
                        <div className="diff-split__side diff-split__side--new">
                            {diffLines
                                .filter((l) => l.line_type !== 'delete')
                                .map((line, index) => (
                                    <div key={index} className={`diff-line diff-line--${line.line_type}`}>
                                        <span className="diff-line__num">{line.new_lineno || ''}</span>
                                        <span className="diff-line__content">{line.content}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
