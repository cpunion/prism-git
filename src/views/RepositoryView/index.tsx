import { useState, useCallback } from 'react';
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

    // Determines if we are in "Commit Mode" or "Working Copy Mode"
    // Working Copy Mode = 'file-status' view OR ('history' view AND selectedCommit is 'WORKING_COPY')
    const isWorkingCopy = state.sidebarView === 'file-status' || (state.sidebarView === 'history' && selectedCommit === 'WORKING_COPY');

    // Handle view change from sidebar
    const handleViewChange = useCallback((view: 'file-status' | 'history' | 'search') => {
        updateState({ sidebarView: view });
        if (view === 'file-status') {
            // When switching to file-status, effectively select working copy
            setSelectedCommit('WORKING_COPY');
        } else if (view === 'history') {
            // When switching to history, default to WORKING_COPY if we were there,
            // or keep selection. If null, maybe default to latest commit?
            // For now let's default to 'WORKING_COPY' (Uncommitted Changes) row
            if (!selectedCommit) setSelectedCommit('WORKING_COPY');
        }
    }, [updateState, selectedCommit]);

    // Main content panel (FileList + DiffViewer)
    const mainContent = (
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
                    mode={isWorkingCopy ? 'working-copy' : 'commit-details'}
                    commitId={isWorkingCopy ? undefined : selectedCommit!}
                    stagedHeight={state.stagedHeight}
                    onStagedHeightChange={(h) => updateState({ stagedHeight: h })}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                />
            }
            second={
                <DiffViewer
                    repoPath={path}
                    commitId={isWorkingCopy ? undefined : selectedCommit!}
                    filePath={selectedFile}
                    viewMode={state.diffViewMode}
                    onViewModeChange={(mode) => updateState({ diffViewMode: mode })}
                />
            }
        />
    );

    return (
        <div className="repository-view">
            <RepoToolbar repoPath={path} repoName={name} />

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
                            onViewChange={handleViewChange}
                            selectedBranch={state.selectedBranch}
                            onBranchSelect={(branch) => updateState({ selectedBranch: branch })}
                            showRemoteBranches={state.showRemoteBranches}
                            onToggleRemoteBranches={() =>
                                updateState({ showRemoteBranches: !state.showRemoteBranches })
                            }
                        />
                    }
                    second={
                        // If in 'history' view, show CommitList split.
                        // If in 'file-status', show update layout (hide commit list)
                        state.sidebarView === 'history' ? (
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
                                second={mainContent}
                            />
                        ) : (
                            // Just show the main content (FileList + Diff) full height
                            mainContent
                        )
                    }
                />
            </div>
        </div>
    );
}
