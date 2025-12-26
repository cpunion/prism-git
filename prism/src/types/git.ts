export interface Repository {
    id: string;
    name: string;
    path: string;
    currentBranch: string;
    addedAt: string;
    lastOpenedAt?: string;
}

export interface CommitInfo {
    id: string;
    shortId: string;
    message: string;
    authorName: string;
    authorEmail: string;
    timestamp: number;
    parentIds: string[];
}

export interface FileInfo {
    path: string;
    status: string;
    statusCode: 'A' | 'M' | 'D' | 'R';
}

export interface FileStatusResponse {
    unstaged: FileInfo[];
    staged: FileInfo[];
}

export interface RepoInfo {
    path: string;
    name: string;
    currentBranch: string;
    isBare: boolean;
}
