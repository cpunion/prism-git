import { useState } from 'react';
import { ResizablePanel } from '../../components/common/ResizablePanel';
import { useLayoutState } from '../../hooks/useLayoutState';
import { RepoToolbar } from './components/Toolbar';
import { RepoSidebar } from './components/Sidebar';
import { CommitList } from './components/CommitList';
import { FileList } from './components/FileList';
import { DiffViewer } from './components/DiffViewer';
import './index.css';

interface RepositoryViewProps {
    path: string;
    name: string;
}

export function RepositoryView({ path, name }: RepositoryViewProps) {
    const { state, updateState } = useLayoutState(path);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedCommit, setSelectedCommit] = useState<string | null>(null);

    return (
        <div className="repository-view">
            {/* Top Toolbar */}
            <RepoToolbar repoPath={path} repoName={name} />

            {/* Main Content Area */}
            <div className="repository-view__content">
                <ResizablePanel
                    direction="horizontal"
                    initialSize={state.sidebarWidth}
                    minSize={180}
                    maxSize={400}
                    storageKey={`sidebar-${path}`}
                    onSizeChange={(w) => updateState({ sidebarWidth: w })}
                    first={
                        <RepoSidebar
                            activeView={state.sidebarView}
                            onViewChange={(view) => updateState({ sidebarView: view })}
                            selectedBranch={state.selectedBranch}
                            onBranchSelect={(branch) => updateState({ selectedBranch: branch })}
                            showRemoteBranches={state.showRemoteBranches}
                            onToggleRemoteBranches={() =>
                                updateState({ showRemoteBranches: !state.showRemoteBranches })
                            }
                        />
                    }
                    second={
                        <ResizablePanel
                            direction="vertical"
                            initialSize={state.commitsHeight}
                            minSize={100}
                            maxSize={500}
                            storageKey={`commits-${path}`}
                            onSizeChange={(h) => updateState({ commitsHeight: h })}
                            first={
                                <CommitList
                                    repoPath={path}
                                    selectedCommit={selectedCommit}
                                    onSelectCommit={setSelectedCommit}
                                />
                            }
                            second={
                                <ResizablePanel
                                    direction="horizontal"
                                    initialSize={state.fileListWidth}
                                    minSize={200}
                                    maxSize={500}
                                    storageKey={`filelist-${path}`}
                                    onSizeChange={(w) => updateState({ fileListWidth: w })}
                                    first={
                                        <FileList
                                            repoPath={path}
                                            stagedHeight={state.stagedHeight}
                                            onStagedHeightChange={(h) => updateState({ stagedHeight: h })}
                                            selectedFile={selectedFile}
                                            onSelectFile={setSelectedFile}
                                        />
                                    }
                                    second={
                                        <DiffViewer
                                            repoPath={path}
                                            filePath={selectedFile}
                                            viewMode={state.diffViewMode}
                                            onViewModeChange={(mode) => updateState({ diffViewMode: mode })}
                                        />
                                    }
                                />
                            }
                        />
                    }
                />
            </div>
        </div>
    );
}
