import { useState, useEffect, useCallback } from 'react';

export interface LayoutState {
    // Sidebar state
    sidebarView: 'file-status' | 'history' | 'search';
    selectedBranch: string | null;

    // Panel sizes
    sidebarWidth: number;
    commitsHeight: number;
    fileListWidth: number;
    stagedHeight: number;

    // View options
    diffViewMode: 'split' | 'unified';
    showRemoteBranches: boolean;
}

const DEFAULT_STATE: LayoutState = {
    sidebarView: 'file-status',
    selectedBranch: null,
    sidebarWidth: 220,
    commitsHeight: 200,
    fileListWidth: 280,
    stagedHeight: 150,
    diffViewMode: 'unified',
    showRemoteBranches: false,
};

/**
 * Hook to persist and restore repository view layout state
 * @param repoPath - Repository path used as storage key
 */
export function useLayoutState(repoPath: string) {
    const storageKey = `repo-layout-${repoPath.replace(/[^a-zA-Z0-9]/g, '-')}`;

    const loadState = (): LayoutState => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                return { ...DEFAULT_STATE, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load layout state:', e);
        }
        return DEFAULT_STATE;
    };

    const [state, setState] = useState<LayoutState>(loadState);

    // Save state on change
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save layout state:', e);
        }
    }, [state, storageKey]);

    // Reload when repo changes
    useEffect(() => {
        setState(loadState());
    }, [repoPath]);

    const updateState = useCallback((updates: Partial<LayoutState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    return { state, updateState };
}

/**
 * Hook to persist window state (position, size) via Tauri
 */
export function useWindowState() {
    // Window state is handled by Tauri's window plugin automatically
    // when configured in tauri.conf.json. This hook is for any additional
    // state we want to track.

    const saveWindowState = useCallback(async () => {
        // Tauri handles this via tauri-plugin-window-state
        // Nothing to do here for now
    }, []);

    return { saveWindowState };
}
