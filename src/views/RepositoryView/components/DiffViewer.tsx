import './DiffViewer.css';

interface DiffViewerProps {
    repoPath: string;
    filePath: string | null;
    viewMode: 'split' | 'unified';
    onViewModeChange: (mode: 'split' | 'unified') => void;
}

export function DiffViewer({ filePath, viewMode, onViewModeChange }: DiffViewerProps) {
    // TODO: Fetch diff from backend

    if (!filePath) {
        return (
            <div className="diff-viewer diff-viewer--empty">
                <div className="diff-viewer__placeholder">
                    <span className="diff-viewer__placeholder-icon">📄</span>
                    <span className="diff-viewer__placeholder-text">
                        Select a file to view changes
                    </span>
                </div>
            </div>
        );
    }

    // Mock diff data
    const diffLines = [
        { type: 'header', content: '@@ -1,7 +1,8 @@' },
        { type: 'context', oldNum: 1, newNum: 1, content: "import React from 'react';" },
        { type: 'context', oldNum: 2, newNum: 2, content: "import { useState } from 'react';" },
        { type: 'add', newNum: 3, content: "import { useEffect } from 'react';" },
        { type: 'context', oldNum: 3, newNum: 4, content: '' },
        { type: 'context', oldNum: 4, newNum: 5, content: 'function App() {' },
        { type: 'delete', oldNum: 5, content: '  const [count, setCount] = useState(0);' },
        { type: 'add', newNum: 6, content: '  const [count, setCount] = useState<number>(0);' },
        { type: 'add', newNum: 7, content: '  const [loading, setLoading] = useState(false);' },
        { type: 'context', oldNum: 6, newNum: 8, content: '' },
        { type: 'context', oldNum: 7, newNum: 9, content: '  return (' },
    ];

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
                    <button className="diff-viewer__action-btn" title="Stage Hunk">
                        Stage Hunk
                    </button>
                    <button className="diff-viewer__action-btn diff-viewer__action-btn--danger" title="Discard Hunk">
                        Discard
                    </button>
                </div>
            </div>

            <div className="diff-viewer__content">
                {viewMode === 'unified' ? (
                    <div className="diff-unified">
                        {diffLines.map((line, index) => (
                            <div
                                key={index}
                                className={`diff-line diff-line--${line.type}`}
                            >
                                {line.type !== 'header' && (
                                    <>
                                        <span className="diff-line__num diff-line__num--old">
                                            {line.type !== 'add' ? (line as { oldNum?: number }).oldNum : ''}
                                        </span>
                                        <span className="diff-line__num diff-line__num--new">
                                            {line.type !== 'delete' ? (line as { newNum?: number }).newNum : ''}
                                        </span>
                                        <span className="diff-line__prefix">
                                            {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                                        </span>
                                    </>
                                )}
                                <span className="diff-line__content">{line.content}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="diff-split">
                        <div className="diff-split__side diff-split__side--old">
                            {diffLines
                                .filter((l) => l.type !== 'add')
                                .map((line, index) => (
                                    <div key={index} className={`diff-line diff-line--${line.type}`}>
                                        <span className="diff-line__num">
                                            {(line as { oldNum?: number }).oldNum}
                                        </span>
                                        <span className="diff-line__content">{line.content}</span>
                                    </div>
                                ))}
                        </div>
                        <div className="diff-split__side diff-split__side--new">
                            {diffLines
                                .filter((l) => l.type !== 'delete')
                                .map((line, index) => (
                                    <div key={index} className={`diff-line diff-line--${line.type}`}>
                                        <span className="diff-line__num">
                                            {(line as { newNum?: number }).newNum}
                                        </span>
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
