import { useState, useEffect } from 'react';
import { ResizablePanel } from '../../../components/common/ResizablePanel';
import { FileStatusBadge } from '../../../components/git/FileStatusBadge';
import { getStatus, getCommitChanges, stageFile, unstageFile } from '../../../api';
import './FileList.css';

interface FileInfo {
    path: string;
    status: string;
    status_code: string;
}

interface FileListProps {
    repoPath: string;
    mode: 'working-copy' | 'commit-details';
    commitId?: string; // Required if mode is 'commit-details'
    stagedHeight: number;
    onStagedHeightChange: (height: number) => void;
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

export function FileList({
    repoPath,
    mode,
    commitId,
    stagedHeight,
    onStagedHeightChange,
    selectedFile,
    onSelectFile,
}: FileListProps) {
    const [stagedFiles, setStagedFiles] = useState<FileInfo[]>([]);
    const [unstagedFiles, setUnstagedFiles] = useState<FileInfo[]>([]);
    const [commitFiles, setCommitFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch status or commit changes
    const loadData = async () => {
        try {
            setLoading(true);
            if (mode === 'working-copy') {
                const status = await getStatus(repoPath);
                setStagedFiles(status.staged);
                setUnstagedFiles(status.unstaged);
            } else if (mode === 'commit-details' && commitId) {
                // Load files for specific commit
                const files = await getCommitChanges(repoPath, commitId);
                setCommitFiles(files);
            }
        } catch (error) {
            console.error('Failed to load file data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [repoPath, mode, commitId]);

    // Handle stage/unstage (only for working copy)
    const handleStageFile = async (path: string) => {
        if (mode !== 'working-copy') return;
        try {
            await stageFile(repoPath, path);
            await loadData();
        } catch (error) {
            console.error('Failed to stage:', error);
        }
    };

    const handleUnstageFile = async (path: string) => {
        if (mode !== 'working-copy') return;
        try {
            await unstageFile(repoPath, path);
            await loadData();
        } catch (error) {
            console.error('Failed to unstage:', error);
        }
    };

    if (loading) {
        return (
            <div className="file-list">
                <div className="file-list__loading">Loading files...</div>
            </div>
        );
    }

    // Render for Commit Details (Read-only single list)
    if (mode === 'commit-details') {
        return (
            <div className="file-list">
                <div className="file-list__header">
                    <span className="file-list__title">Changed Files ({commitFiles.length})</span>
                </div>
                <div className="file-list__items">
                    {commitFiles.map((file) => (
                        <button
                            key={file.path}
                            className={`file-item ${selectedFile === file.path ? 'file-item--selected' : ''}`}
                            onClick={() => onSelectFile(file.path)}
                        >
                            <FileStatusBadge status={file.status_code} />
                            <span className="file-item__path">{file.path}</span>
                        </button>
                    ))}
                    {commitFiles.length === 0 && (
                        <div className="file-list__empty">No changed files found</div>
                    )}
                </div>
            </div>
        );
    }

    // Render for Working Copy (Staged/Unstaged split view)
    return (
        <div className="file-list">
            <ResizablePanel
                direction="vertical"
                initialSize={stagedHeight}
                minSize={80}
                maxSize={400}
                storageKey="filelist-staged"
                onSizeChange={onStagedHeightChange}
                first={
                    <div className="file-list__section">
                        <div className="file-list__header">
                            <span className="file-list__title">✓ Staged ({stagedFiles.length})</span>
                        </div>
                        <div className="file-list__items">
                            {stagedFiles.map((file) => (
                                <button
                                    key={file.path}
                                    className={`file-item ${selectedFile === file.path ? 'file-item--selected' : ''}`}
                                    onClick={() => onSelectFile(file.path)}
                                >
                                    <input
                                        type="checkbox"
                                        className="file-item__checkbox"
                                        checked={true}
                                        onChange={() => handleUnstageFile(file.path)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <FileStatusBadge status={file.status_code} />
                                    <span className="file-item__path">{file.path}</span>
                                </button>
                            ))}
                            {stagedFiles.length === 0 && (
                                <div className="file-list__empty">No staged files</div>
                            )}
                        </div>
                    </div>
                }
                second={
                    <div className="file-list__section">
                        <div className="file-list__header">
                            <span className="file-list__title">○ Unstaged ({unstagedFiles.length})</span>
                        </div>
                        <div className="file-list__items">
                            {unstagedFiles.map((file) => (
                                <button
                                    key={file.path}
                                    className={`file-item ${selectedFile === file.path ? 'file-item--selected' : ''}`}
                                    onClick={() => onSelectFile(file.path)}
                                >
                                    <input
                                        type="checkbox"
                                        className="file-item__checkbox"
                                        checked={false}
                                        onChange={() => handleStageFile(file.path)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <FileStatusBadge status={file.status_code} />
                                    <span className="file-item__path">{file.path}</span>
                                </button>
                            ))}
                            {unstagedFiles.length === 0 && (
                                <div className="file-list__empty">Working tree clean</div>
                            )}
                        </div>
                    </div>
                }
            />
        </div>
    );
}
