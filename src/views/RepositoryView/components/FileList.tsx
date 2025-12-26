import { ResizablePanel } from '../../../components/common/ResizablePanel';
import { FileStatusBadge } from '../../../components/git/FileStatusBadge';
import './FileList.css';

interface FileInfo {
    path: string;
    status: string;
    statusCode: string;
}

interface FileListProps {
    repoPath: string;
    stagedHeight: number;
    onStagedHeightChange: (height: number) => void;
    selectedFile: string | null;
    onSelectFile: (path: string) => void;
}

export function FileList({
    stagedHeight,
    onStagedHeightChange,
    selectedFile,
    onSelectFile,
}: FileListProps) {
    // TODO: Fetch from backend
    const stagedFiles: FileInfo[] = [
        { path: 'src/main.ts', status: 'Modified', statusCode: 'M' },
        { path: 'src/utils.ts', status: 'Added', statusCode: 'A' },
    ];

    const unstagedFiles: FileInfo[] = [
        { path: 'src/app.tsx', status: 'Modified', statusCode: 'M' },
        { path: 'src/index.css', status: 'Modified', statusCode: 'M' },
        { path: 'README.md', status: 'Modified', statusCode: 'M' },
        { path: 'new-file.txt', status: 'Untracked', statusCode: 'U' },
    ];

    const handleStageFile = (path: string) => {
        console.log('Stage file:', path);
        // TODO: Call backend
    };

    const handleUnstageFile = (path: string) => {
        console.log('Unstage file:', path);
        // TODO: Call backend
    };

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
                            <span className="file-list__title">
                                ✓ Staged ({stagedFiles.length})
                            </span>
                            <button className="file-list__action" title="Unstage All">
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
                                    <FileStatusBadge status={file.statusCode} />
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
                            <span className="file-list__title">
                                ○ Unstaged ({unstagedFiles.length})
                            </span>
                            <button className="file-list__action" title="Stage All">
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
                                    <FileStatusBadge status={file.statusCode} />
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
