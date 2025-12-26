# Prism - 技术架构文档

> Tauri + Rust + React 技术栈

## 1. 技术栈选型

### 1.1 框架选择：Tauri
- **原因**：系统原生 WebView，包体积小，性能优秀
- **版本**：Tauri 2.1
- **优势**：
  - 比 Electron 小 20+ 倍
  - 比 SourceTree 快 5-10 倍
  - 统一代码库跨平台

### 1.2 后端：Rust
- **Git 库**：git2 0.19 (libgit2 绑定)
- **异步运行时**：tokio 1.x
- **序列化**：serde 1.x
- **文件监控**：notify 6.x

### 1.3 前端：React + TypeScript
- **UI 框架**：React 18
- **语言**：TypeScript 5.x
- **构建工具**：Vite 6.x
- **代码编辑器**：Monaco Editor（Diff 视图）
- **虚拟滚动**：react-window（大列表优化）
- **状态管理**：Zustand 或 Jotai（轻量级）

## 2. 项目结构

```
prism/
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   ├── main.rs        # 入口 + Tauri 命令注册
│   │   ├── models.rs      # 数据模型
│   │   ├── git/           # Git 操作模块
│   │   │   ├── mod.rs
│   │   │   ├── repository.rs  # 仓库操作
│   │   │   ├── commit.rs      # 提交相关
│   │   │   ├── branch.rs      # 分支管理
│   │   │   ├── diff.rs        # Diff 计算
│   │   │   └── remote.rs      # 远程操作
│   │   ├── watcher.rs     # 文件监控
│   │   └── utils.rs       # 工具函数
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                    # React 前端
│   ├── main.tsx           # 入口
│   ├── App.tsx            # 根组件
│   ├── components/        # UI 组件
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── StatusBar.tsx
│   │   ├── FileStatus/
│   │   │   ├── FileList.tsx
│   │   │   └── FileItem.tsx
│   │   ├── History/
│   │   │   ├── CommitList.tsx
│   │   │   ├── CommitItem.tsx
│   │   │   └── BranchGraph.tsx
│   │   ├── Diff/
│   │   │   ├── DiffViewer.tsx
│   │   │   └── Monaco Editor.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Badge.tsx
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useRepository.ts
│   │   ├── useCommits.ts
│   │   └── useFileStatus.ts
│   ├── api/               # Tauri API 封装
│   │   └── git.ts
│   ├── stores/            # 状态管理
│   │   └── repoStore.ts
│   ├── styles/            # 样式文件
│   │   ├── variables.css
│   │   └── global.css
│   └── types/             # TypeScript 类型
│       └── git.ts
│
├── docs/                  # 文档
│   ├── requirements.md
│   ├── ui-design.md
│   ├── ui-prompts.md
│   └── architecture.md
│
└── package.json
```

## 3. 核心模块设计

### 3.1 Git 操作模块（Rust）

#### 3.1.1 Repository 模块
```rust
// src-tauri/src/git/repository.rs
pub struct RepositoryManager {
    repo: git2::Repository,
    path: PathBuf,
}

impl RepositoryManager {
    pub fn open(path: &str) -> Result<Self>;
    pub fn get_info() -> RepoInfo;
    pub fn get_current_branch() -> String;
}
```

#### 3.1.2 Commit 模块
```rust
// src-tauri/src/git/commit.rs
pub fn get_commit_history(
    repo: &Repository,
    limit: usize,
    offset: usize,
) -> Result<Vec<CommitInfo>>;

pub fn create_commit(
    repo: &Repository,
    message: &str,
) -> Result<String>;
```

#### 3.1.3 Diff 模块
```rust
// src-tauri/src/git/diff.rs
pub fn get_file_diff(
    repo: &Repository,
    file_path: &str,
) -> Result<DiffResponse>;

pub fn get_commit_diff(
    repo: &Repository,
    commit_id: &str,
) -> Result<Vec<DiffResponse>>;
```

### 3.2 Tauri 命令（IPC 接口）

```rust
// src-tauri/src/main.rs

// 仓库管理
#[tauri::command]
async fn open_repo(path: String) -> Result<RepoInfo, String>;

// 查找 Git 仓库根目录（支持子目录）
#[tauri::command]
fn find_git_root(path: String) -> Result<String, String>;

// 验证是否为 Git 仓库
#[tauri::command]
fn is_git_repository(path: String) -> Result<bool, String>;

// 初始化 Git 仓库
#[tauri::command]
fn init_repository(path: String) -> Result<(), String>;

// 提交历史
#[tauri::command]
async fn get_commits(
    path: String,
    limit: usize,
    offset: usize,
) -> Result<Vec<CommitInfo>, String>;

#[tauri::command]
async fn get_file_status(
    path: String,
) -> Result<FileStatusResponse, String>;

#[tauri::command]
async fn stage_files(
    path: String,
    files: Vec<String>,
) -> Result<(), String>;

#[tauri::command]
async fn create_commit(
    path: String,
    message: String,
) -> Result<String, String>;
```

### 3.3 前端 API 封装

```typescript
// src/api/git.ts
import { invoke } from '@tauri-apps/api/core';

export const gitApi = {
  openRepo: (path: string) =>
    invoke<RepoInfo>('open_repo', { path }),

  getCommits: (path: string, limit: number, offset: number) =>
    invoke<CommitInfo[]>('get_commits', { path, limit, offset }),

  getFileStatus: (path: string) =>
    invoke<FileStatusResponse>('get_file_status', { path }),

  stageFiles: (path: string, files: string[]) =>
    invoke('stage_files', { path, files }),

  createCommit: (path: string, message: string) =>
    invoke<string>('create_commit', { path, message }),
};
```

## 4. 性能优化策略

### 4.1 后端优化
- **异步处理**：所有 Git 操作使用 `tokio::spawn_blocking`
- **分页加载**：Commit 历史分页（limit/offset）
- **缓存机制**：Commit 元数据缓存
- **并发控制**：限制同时进行的 Git 操作数量

### 4.2 前端优化
- **虚拟滚动**：react-window 处理大列表
- **懒加载**：Monaco Editor 按需加载
- **防抖节流**：搜索、过滤等操作防抖
- **Web Workers**：Diff 高亮计算移到 Worker

### 4.3 IPC 优化
- **批量操作**：减少 IPC 调用次数
- **数据压缩**：大数据传输时压缩
- **增量更新**：只传输变化的数据

## 5. 数据流设计

```
用户操作
   ↓
React 组件
   ↓
Zustand Store (状态管理)
   ↓
Tauri API (IPC)
   ↓
Rust 命令处理
   ↓
Git2 操作
   ↓
返回结果
   ↓
更新 Store
   ↓
重新渲染
```

## 6. 错误处理

### 6.1 Rust 端
```rust
pub type Result<T> = std::result::Result<T, GitError>;

#[derive(Debug, Serialize)]
pub enum GitError {
    RepoNotFound(String),
    InvalidPath(String),
    GitOperationFailed(String),
}
```

### 6.2 TypeScript 端
```typescript
try {
  const commits = await gitApi.getCommits(repoPath, 100, 0);
} catch (error) {
  console.error('Failed to load commits:', error);
  toast.error('加载提交历史失败');
}
```

## 7. 测试策略

### 7.1 Rust 单元测试
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_open_repository() {
        // ...
    }
}
```

### 7.2 前端单元测试
- Jest + React Testing Library
- 组件快照测试
- Hook 测试

### 7.3 集成测试
- Tauri 端到端测试
- 模拟 Git 仓库测试

## 8. 部署和打包

### 8.1 开发环境
```bash
npm run tauri:dev
```

### 8.2 生产构建
```bash
npm run tauri:build
```

### 8.3 平台特定优化
- **macOS**: `.dmg` + `.app`
- **Windows**: `.msi` + `.exe`
- **Linux**: `.AppImage` + `.deb`

## 9. 后续扩展方向

### 9.1 插件系统
- 自定义 Git 操作
- 主题扩展
- 快捷键自定义

### 9.2 云同步
- 设置同步
- 仓库列表同步

### 9.3 AI 功能
- Commit 消息生成
- Code Review 建议
- 冲突解决建议
