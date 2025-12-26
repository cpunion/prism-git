import { useState, useEffect } from 'react';
import { ResizablePanel } from '../../../components/common/ResizablePanel';
import { FileStatusBadge } from '../../../components/git/FileStatusBadge';
import { getStatus, stageFile, unstageFile } from '../../../api';
import './FileList.css';

interface FileInfo {
    path: string;
    status: string;
    status_code: string;
}

interface FileListProps {
    repoPath: string;
    stagedHeight: number;
    onStagedHeightChange: (height: number) => void;
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

export function FileList({
    repoPath,
    stagedHeight,
    onStagedHeightChange,
    selectedFile,
    onSelectFile,
}: FileListProps) {
    const [stagedFiles, setStagedFiles] = useState<FileInfo[]>([]);
    const [unstagedFiles, setUnstagedFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch file status
    const loadStatus = async () => {
        try {
            setLoading(true);
            const status = await getStatus(repoPath);
            setStagedFiles(status.staged);
            setUnstagedFiles(status.unstaged);
        } catch (error) {
            console.error('Failed to load status:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load status on mount and when repo changes
    useEffect(() => {
        loadStatus();
    }, [repoPath]);

    // Handle stage file
    const handleStageFile = async (path: string) => {
        try {
            await stageFile(repoPath, path);
            await loadStatus(); // Reload after staging
        } catch (error) {
            console.error('Failed to stage file:', error);
            alert(`Failed to stage file: ${error}`);
        }
    };

    // Handle unstage file
    const handleUnstageFile = async (path: string) => {
        try {
            await unstageFile(repoPath, path);
            await loadStatus(); // Reload after unstaging
        } catch (error) {
            console.error('Failed to unstage file:', error);
            alert(`Failed to unstage file: ${error}`);
        }
    };

    if (loading) {
        return (
            <div className="file-list">
                <div className="file-list__loading">Loading files...</div>
            </div>
        );
    }

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
                            <button
                                className="file-list__action"
                                title="Unstage All"
                                disabled={stagedFiles.length === 0}
                            >
                                −
                            </button>
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
                                    <button className="file-item__menu" onClick={(e) => e.stopPropagation()}>
                                        ⋮
                                    </button>
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
                            <button
                                className="file-list__action"
                                title="Stage All"
                                disabled={unstagedFiles.length === 0}
                            >
                                +
                            </button>
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
                                    <button className="file-item__menu" onClick={(e) => e.stopPropagation()}>
                                        ⋮
                                    </button>
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
