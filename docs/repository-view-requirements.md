# Repository View Requirements

## Overview

The repository view follows a nested resizable panel layout, inspired by Tower's design.

![Tower Reference](file:///Users/lijie/.gemini/antigravity/brain/53c1f857-16be-4104-9dc6-6d54d23fbcff/uploaded_image_1766724796964.png)

## Component Hierarchy

```
Window
└── Column (Vertical)
    ├── Toolbar              // Git operation buttons
    └── Row (Horizontal)     // Main content area
        ├── Sidebar          // Branches & workspace
        └── Column (Vertical)
            ├── Commits      // Commit history list
            └── Row (Horizontal)
                ├── Column (Vertical)
                │   ├── Staged Files    // Files ready to commit
                │   └── Unstaged Files  // Working directory changes
                └── FileDiff           // Diff viewer
```

**Key Feature**: All dividers between components are **draggable/resizable**

---

## 1. Toolbar (Top)

### Layout
- **Horizontal button group**
- Fixed height (40-50px)
- Spans full width

### Buttons (Left to Right)

| Button | Icon | Action |
|--------|------|--------|
| Commit | 📝 | Open commit dialog |
| Pull | ↓ | Pull from remote |
| Push | ↑ | Push to remote |
| Fetch | ⟳ | Fetch updates |
| Branch | 🌿 | Branch menu |
| Merge | ⑂ | Merge branches |
| Stash | 📦 | Stash changes |

### Right Side
- **View options** (icon buttons)
- **Repository settings** (⚙️)

---

## 2. Sidebar (Left Panel)

### Dimensions
- **Width**: 200-300px (resizable)
- **Min width**: 150px
- **Resize**: Right edge draggable

### Structure

#### WORKSPACE Section

```
WORKSPACE
├── File Status (badge: uncommitted count)
└── Search
```

**File Status** - Click to filter file list
- Shows count of uncommitted changes
- Active state when selected

**Search** - Search files/commits
- Text input with icon
- Live filtering

#### BRANCHES Section

```
BRANCHES
├── Local Branches
│   ├── main ⭐
│   ├── develop
│   ├── feature-x
│   └── ... (show all)
└── Remote Branches (expandable)
    ├── origin (expandable)
    │   ├── main
    │   ├── develop
    │   └── ...
    └── upstream (if exists)
```

**Visual States**:
- **Current branch**: Bold + highlight
- **Hover**: Light gray background
- **Count badge**: Total branches (e.g., `13`)

**Interactions**:
- Click → Switch branch
- Right-click → Context menu (Delete, Rename, etc.)
- Double-click remote → Checkout as local

---

## 3. Commits (Top-Right Panel)

### Dimensions
- **Height**: 30-50% of right area (resizable)
- **Resize**: Bottom edge draggable

### Layout

#### Filter Toolbar
```
[All Branches ▼] [Show Remote Branches ▼] [Ancestor Order ▼] [🔍 Search]
```

#### Commit List

```
┌─────────────────────────────────────────────────────────────┐
│ Today at 12:52                                        [+]   │
│ ├─ 52ba77ab  visualfc  feat: add type support        │
│ ├─ e4b652fb  visualfc  fix: clean code               │
│ └─ 4bcd4e3b  visualfc  refactor: rename              │
├─────────────────────────────────────────────────────────────│
│ Yesterday at 9:01                                           │
│ ├─ aef1k3d2  visualfc  docs: update README           │
│ └─ 27c57ae1  visualfc  test: add unit tests          │
└─────────────────────────────────────────────────────────────┘
```

**Columns**:
- **Graph**: Branch/merge visualization
- **Hash**: Short commit hash (7 chars)
- **Author**: Author name
- **Message**: Commit message (truncated)
- **Time**: Relative time grouping

**Interactions**:
- Click → Show commit diff in FileDiff panel
- Double-click → Show commit details dialog
- Right-click → Context menu (Cherry-pick, Revert, etc.)

---

## 4. File List (Bottom-Left Panel)

### Dimensions
- **Width**: 30-40% of bottom area (resizable)
- **Height**: 50-70% of right area
- **Resize**: Right edge draggable

### Structure

```
Column (Vertical, 100% height)
├── Staged Files    (resizable, ~50% height)
└── Unstaged Files  (resizable, ~50% height)
```

**Divider**: Horizontal draggable divider between staged/unstaged

---

### 4.1 Staged Files

```
✅ Staged Files (3)                    [Stage All ▼] [Unstage All]

☑ 📁 src
    ☑ 📄 main.ts           [M]  ⋮
    ☑ 📄 utils.ts          [A]  ⋮
☑ 📄 package.json          [M]  ⋮
```

**Features**:
- **Checkbox**: ✅ = Staged, click to unstage
- **Folder grouping**: Collapsible folders
- **Status badge**: `M` (Modified), `A` (Added), `D` (Deleted), `R` (Renamed)
- **Three-dot menu**: File actions
- **Drag & drop**: Reorder or move to unstaged

**Header Actions**:
- **Stage All ▼**: Stage all unstaged files
- **Unstage All**: Clear staging area

---

### 4.2 Unstaged Files

```
☐ Unstaged Files (5)                   [Discard All ▼]

☐ 📁 src
    ☐ 📄 app.tsx           [M]  ⋮
    ☐ 📄 index.css         [M]  ⋮
☐ 📄 README.md             [M]  ⋮
☐ ❓ new-file.txt          [U]  ⋮  (Untracked)
```

**Features**:
- **Checkbox**: ☐ = Unstaged, click to stage
- **Untracked files**: Different icon (❓) and color
- **Status badge**: Same as staged
- **Three-dot menu**: File actions

**Header Actions**:
- **Discard All ▼**: Discard all changes (with confirmation)

---

### File Item Interactions

**Click Checkbox**:
- Staged → Unstaged
- Unstaged → Staged

**Click File**:
- Show diff in FileDiff panel
- Highlight selected file

**Double-Click File**:
- Open in external editor

**Three-Dot Menu**:
```
┌─────────────────────┐
│ Open in Editor      │
│ Reveal in Finder    │
│ Copy Path           │
├─────────────────────┤
│ Stage File          │ (if unstaged)
│ Unstage File        │ (if staged)
│ Discard Changes     │ (if unstaged)
└─────────────────────┘
```

---

## 5. FileDiff (Bottom-Right Panel)

### Dimensions
- **Width**: 60-70% of bottom area (resizable)
- **Height**: 50-70% of right area
- **Resize**: Left edge draggable

### Structure

#### File Selector (Top)
```
┌────────────────────────────────────────────────────┐
│ 📄 src/main.ts                           [Split ▼] │
└────────────────────────────────────────────────────┘
```

**Elements**:
- **File path**: Breadcrumb or full path
- **View mode dropdown**: Split / Unified
- **Stage/Discard buttons**: (for unstaged files)

#### Diff Content

**Split View** (Side-by-side):
```
┌──────────────────────────┬──────────────────────────┐
│ Before (Old)             │ After (New)              │
├──────────────────────────┼──────────────────────────┤
│ 1  import React from...  │ 1  import React from...  │
│ 2  import { useState }   │ 2  import { useState }   │
│ 3                        │ 3  import { useEffect }  │ +
│ 4  function App() {      │ 4  function App() {      │
│ 5    const [count,       │ 5    const [count,       │
│ 6      setCount] = ...   │ 6      setCount] = ...   │
│ 7    return (            │ 7                        │ -
│                          │ 8    return (            │
└──────────────────────────┴──────────────────────────┘
```

**Unified View** (Inline):
```
┌────────────────────────────────────────────────────┐
│ @@ -1,7 +1,8 @@                                    │
│ 1  import React from 'react'                       │
│ 2  import { useState } from 'react'                │
│ +  import { useEffect } from 'react'               │ Green background
│ 3  function App() {                                │
│ 4    const [count, setCount] = useState(0)         │
│ -  return (                                        │ Red background
│ +  return (                                        │ Green background
└────────────────────────────────────────────────────┘
```

**Features**:
- **Line numbers**: Both old and new
- **Syntax highlighting**: Based on file type
- **Color coding**:
  - Green: Added lines
  - Red: Deleted lines
  - Gray: Unchanged (context) lines
- **Hunk headers**: `@@ -1,7 +1,8 @@` with expand/collapse
- **Scroll sync**: In split view, sync scrolling

#### Hunk Actions (for Unstaged Files)

```
┌────────────────────────────────────────────────────┐
│ Hunk 1: lines 10-24              [Stage] [Discard] │
├────────────────────────────────────────────────────┤
│ + const newFeature = true                          │
│   const oldCode = false                            │
└────────────────────────────────────────────────────┘
```

**Buttons**:
- **Stage Hunk**: Stage only this hunk
- **Discard Hunk**: Discard changes in this hunk

---

## Resizable Panels Implementation

### Dividers

| Divider | Location | Direction | Cursor |
|---------|----------|-----------|--------|
| **D1** | Sidebar ↔ Main Area | Vertical | `col-resize` |
| **D2** | Commits ↔ Files+Diff | Horizontal | `row-resize` |
| **D3** | Staged ↔ Unstaged | Horizontal | `row-resize` |
| **D4** | Files ↔ Diff | Vertical | `col-resize` |

### Resize Behavior

1. **Hover**: Show resize cursor + subtle highlight
2. **Drag**:
   - Real-time resize while dragging
   - Show ghost divider line during drag
3. **Constraints**:
   - Min width: 200px (Sidebar), 300px (Files), 400px (Diff)
   - Min height: 150px (Commits), 100px (Staged/Unstaged)
4. **Persist**: Save panel sizes to `localStorage`

### Visual Feedback

```css
.divider {
  background: transparent;
  transition: background 0.2s;
}

.divider:hover {
  background: rgba(0, 0, 0, 0.1);
}

.divider.dragging {
  background: rgba(0, 100, 255, 0.3);
}
```

---

## State Management

### Global State

```typescript
interface RepositoryState {
  // Current selection
  selectedBranch: string;
  selectedFile: string | null;
  selectedCommit: string | null;

  // File lists
  stagedFiles: FileInfo[];
  unstagedFiles: FileInfo[];

  // Panel sizes (persisted)
  panelSizes: {
    sidebarWidth: number;
    commitsHeight: number;
    stagedHeight: number;
    filesWidth: number;
  };

  // View state
  diffViewMode: 'split' | 'unified';
  showRemoteBranches: boolean;
}
```

### Component Props

```typescript
// Toolbar
interface ToolbarProps {
  onCommit: () => void;
  onPull: () => void;
  onPush: () => void;
  onFetch: () => void;
  // ...
}

// Sidebar
interface SidebarProps {
  branches: BranchInfo[];
  currentBranch: string;
  onSwitchBranch: (name: string) => void;
  width: number;
  onResize: (width: number) => void;
}

// Commits
interface CommitsProps {
  commits: CommitInfo[];
  selectedCommit: string | null;
  onSelectCommit: (id: string) => void;
  height: number;
  onResize: (height: number) => void;
}

// FileList
interface FileListProps {
  staged: FileInfo[];
  unstaged: FileInfo[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  onStageFile: (path: string) => void;
  onUnstageFile: (path: string) => void;
  width: number;
  onResize: (width: number) => void;
}

// FileDiff
interface FileDiffProps {
  file: string | null;
  diff: DiffContent | null;
  viewMode: 'split' | 'unified';
  onStageHunk: (hunkId: string) => void;
  onDiscardHunk: (hunkId: string) => void;
}
```

---

## Backend API Requirements

### File Operations

```rust
// Stage/Unstage
fn stage_file(path: String) -> Result<()>;
fn unstage_file(path: String) -> Result<()>;
fn stage_all() -> Result<()>;
fn unstage_all() -> Result<()>;
fn discard_file(path: String) -> Result<()>;

// Get file lists
fn get_status() -> Result<FileStatusResponse> {
    staged: Vec<FileInfo>,
    unstaged: Vec<FileInfo>,
}
```

### Diff Operations

```rust
// Get diff for a file
fn get_file_diff(path: String, staged: bool) -> Result<DiffContent>;

// Get commit diff
fn get_commit_diff(commit_id: String) -> Result<Vec<FileDiff>>;

// Partial staging
fn stage_hunk(path: String, hunk_id: String) -> Result<()>;
fn discard_hunk(path: String, hunk_id: String) -> Result<()>;
```

### Commit Operations

```rust
fn commit(message: String, amend: bool) -> Result<CommitInfo>;
fn get_commits(limit: usize, offset: usize) -> Result<Vec<CommitInfo>>;
```

### Branch Operations

```rust
fn get_branches() -> Result<BranchList>;
fn switch_branch(name: String) -> Result<()>;
fn create_branch(name: String, base: Option<String>) -> Result<()>;
fn delete_branch(name: String, force: bool) -> Result<()>;
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Stage/unstage selected file |
| `Cmd+Enter` | Commit |
| `Cmd+A` | Select all files |
| `↑/↓` | Navigate file/commit list |
| `←/→` | Collapse/expand folders |
| `Tab` | Move between panels |
| `Cmd+K` | Focus search |
| `Cmd+1/2/3` | Switch tabs (if multiple repos) |
| `Cmd+Shift+P` | Command palette |

---

## Design Tokens

### Colors

```css
/* Primary */
--color-primary: #007AFF;
--color-primary-hover: #0051D5;

/* Status */
--color-added: #28A745;     /* Green */
--color-deleted: #D73A49;   /* Red */
--color-modified: #FFA500;  /* Orange */
--color-untracked: #6A737D; /* Gray */

/* Background */
--bg-panel: #FFFFFF;
--bg-hover: #F3F4F6;
--bg-selected: #007AFF;
--bg-selected-text: #FFFFFF;

/* Diff */
--diff-added-bg: #E6FFEC;
--diff-added-text: #24292E;
--diff-deleted-bg: #FFEEF0;
--diff-deleted-text: #24292E;
```

### Typography

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;

--text-xs: 11px;
--text-sm: 12px;
--text-base: 13px;
--text-lg: 14px;
```

---

## Future Enhancements

- **Commit message input**: Bottom panel with subject/body
- **Conflicts resolver**: 3-way merge view
- **Partial line staging**: Stage individual lines
- **File tree view**: Hierarchical folder view
- **Blame integration**: Inline git blame
- **Stash management**: Stash list panel
- **Tag support**: Create/manage tags
- **Rebase UI**: Interactive rebase editor
