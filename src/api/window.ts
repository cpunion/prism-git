import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

interface OpenRepoWindowOptions {
  showAddDialog?: boolean;
}

/**
 * Open a repository in a new window
 */
export async function openRepoWindow(
  path: string,
  name: string,
  options?: OpenRepoWindowOptions
): Promise<void> {
  // Create unique window label from path
  const label = `repo-${path.replace(/[^a-zA-Z0-9]/g, '-').slice(-50)}`;

  // Check if window already exists
  const existingWindow = await WebviewWindow.getByLabel(label);
  if (existingWindow) {
    await existingWindow.setFocus();
    return;
  }

  // Build URL with optional add dialog flag
  let url = `/repo/window?path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`;
  if (options?.showAddDialog) {
    url += '&showAddDialog=true';
  }

  // Create new window
  const webview = new WebviewWindow(label, {
    url,
    title: name,
    width: 1200,
    height: 800,
    center: true,
    decorations: true,
    resizable: true,
  });

  // Log any errors
  webview.once('tauri://error', (e) => {
    console.error('Window creation error:', e);
  });
}

/**
 * Get all open repository windows
 */
export async function getOpenRepoWindows(): Promise<string[]> {
  const windows = await WebviewWindow.getAll();
  return windows.filter((w) => w.label.startsWith('repo-')).map((w) => w.label);
}

/**
 * Close a repository window
 */
export async function closeRepoWindow(label: string): Promise<void> {
  const window = await WebviewWindow.getByLabel(label);
  if (window) {
    await window.close();
  }
}
