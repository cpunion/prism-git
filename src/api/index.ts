import { invoke } from '@tauri-apps/api/core';

export interface RepositoryConfig {
  id: string;
  name: string;
  path: string;
  added_at: string;
  last_opened_at: string | null;
}

export interface RepoInfo {
  path: string;
  name: string;
  current_branch: string;
  is_bare: boolean;
}

export interface CommitInfo {
  id: string;
  short_id: string;
  message: string;
  author_name: string;
  author_email: string;
  timestamp: number;
  parent_ids: string[];
}

export interface FileInfo {
  path: string;
  status: string;
  status_code: string;
}

export interface FileStatusResponse {
  staged: FileInfo[];
  unstaged: FileInfo[];
}

export interface DiffResponse {
  file_path: string;
  old_content: string;
  new_content: string;
  hunks: any[];
}

// Repository list operations
export async function getRepositoryList(): Promise<RepositoryConfig[]> {
  return invoke<RepositoryConfig[]>('get_repository_list');
}

export async function addRepository(path: string, name?: string): Promise<RepositoryConfig> {
  return invoke<RepositoryConfig>('add_repository', { path, name });
}

export async function removeRepository(id: string): Promise<boolean> {
  return invoke<boolean>('remove_repository', { id });
}

// Repository operations
export async function openRepo(path: string): Promise<RepoInfo> {
  return invoke<RepoInfo>('open_repo', { path });
}

export async function getCommits(
  path: string,
  limit: number,
  offset: number
): Promise<CommitInfo[]> {
  return invoke<CommitInfo[]>('get_commits', { path, limit, offset });
}

export async function getStatus(path: string): Promise<FileStatusResponse> {
  return invoke<FileStatusResponse>('get_status', { path });
}

export async function getDiff(path: string, filePath: string): Promise<DiffResponse> {
  return invoke<DiffResponse>('get_diff', { path, file_path: filePath });
}

// Git utilities
export async function findRepoRoot(path: string): Promise<string> {
  return invoke<string>('find_repo_root', { path });
}

export async function checkIsGitRepo(path: string): Promise<boolean> {
  return invoke<boolean>('check_is_git_repo', { path });
}

export async function initRepository(path: string): Promise<void> {
  return invoke<void>('init_repository', { path });
}

// CLI support
export async function getInitialRepoPath(): Promise<string | null> {
  return invoke<string | null>('get_initial_repo_path');
}

// Stage/Unstage operations
export async function stageFile(repoPath: string, filePath: string): Promise<void> {
  return invoke<void>('stage_file', { repo_path: repoPath, file_path: filePath });
}

export async function unstageFile(repoPath: string, filePath: string): Promise<void> {
  return invoke<void>('unstage_file', { repo_path: repoPath, file_path: filePath });
}

// Commit operations
export async function commitChanges(repoPath: string, message: string): Promise<string> {
  return invoke<string>('commit_changes', { repo_path: repoPath, message });
}

export async function getCommitChanges(repoPath: string, commitId: string): Promise<FileInfo[]> {
  return invoke<FileInfo[]>('get_commit_changes', { repo_path: repoPath, commit_id: commitId });
}

export async function getCommitFileDiff(repoPath: string, commitId: string, filePath: string): Promise<DiffResponse> {
  return invoke<DiffResponse>('get_commit_file_diff', { repo_path: repoPath, commit_id: commitId, file_path: filePath });
}
