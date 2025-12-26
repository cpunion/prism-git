# Repository View Requirements

## Overview

The repository view is a three-panel resizable layout for Git operations, inspired by Tower's design.

![Tower Reference](file:///Users/lijie/.gemini/antigravity/brain/53c1f857-16be-4104-9dc6-6d54d23fbcff/uploaded_image_1766724796964.png)

## Layout Structure

### Three-Panel Layout (Resizable)

```
┌─────────────┬──────────────────┬──────────────────┐
│             │                  │                  │
│  Sidebar    │  File List       │  Detail View     │
│  (Left)     │  (Center)        │  (Right)         │
│             │                  │                  │
│  固定宽度可调  │   可调宽度        │   可调宽度        │
└─────────────┴──────────────────┴──────────────────┘
```

**Key Feature**: All dividers are **draggable/resizable** - not fixed width/height

## Panel 1: Sidebar (Left)

### Top Toolbar
- Commit, Pull, Push, Fetch, Branch, Merge, Stash buttons
- Clear icons with labels

### WORKSPACE Section

#### File Status
- **Uncommitted changes** (count badge)
- **Staged files** (expandable tree)
- **Unstaged files** (expandable tree)

#### Search
- Search files/commits

### BRANCHES Section

#### Local Branches
- List of all local branches
- Current branch highlighted
- Branch count badge (e.g., `13`)

#### Remote Branches
- Expandable remote branches tree

#### Features
- Click to switch branch
- Right-click context menu (delete, rename, etc.)

## Panel 2: File List (Center)

### Top Toolbar
- **Filter Options**:
  - All Branches / Show Remote Branches
  - Ancestor Order / Compact View
- **Search bar** for filtering

### File Tree View

#### Staged Files Section
- ✅ Checkbox for each file (checked = staged)
- **Folder icon** for directories
- **File icon** based on type
- **Status badge** (A/M/D/R/etc.)
- **Three-dot menu** for individual file actions

#### Unstaged Files Section
- ☐ Checkbox (unchecked = unstaged)
- Same structure as staged files

#### Interactions
- **Click checkbox**: Stage/unstage file
- **Click file**: Show diff in detail panel
- **Double-click**: Open in external editor
- **Drag & drop**: Move between staged/unstaged

#### Visual States
- **Selected file**: Blue highlight
- **Hover**: Light gray background
- **Checkbox hover**: Show as clickable

## Panel 3: Detail View (Right)

### Tab Bar
- **Commit** tab (show commits)
- **Author** tab (filter by author)
- **Jump to:** dropdown

### Top Section: Commit History

#### Commit List
- **Time grouping**: "Today at 12:52", "Yesterday at 9:0..."
- **Commit hash** (short, e.g., `52ba77ab`)
- **Author email**
- **Commit message** (truncated with `...` if long)
- **Plus icon** (+) for new commits

#### Visual Elements
- **Graph/line** showing commit branch structure
- **Hover**: Show full commit message tooltip

### Bottom Section: Diff Viewer

#### File Selector
- **Breadcrumb**: `out_ll > ... > reflect/typeutil.ll`
- **Stage hunk / Discard hunk** buttons

#### Diff Display (Split View)
- **Hunk headers**: `Hunk 1`, `Hunk 2` with line ranges
- **Line numbers** on both sides
- **+ Green** for additions
- **- Red** for deletions
- **Syntax highlighting** based on file type
- **Gray context** lines (unchanged)

#### Navigation
- **Stage hunk / Discard hunk** buttons per hunk
- Scroll to navigate large diffs

## Resizable Panels

### Implementation Requirements

1. **Draggable Dividers**
   - Vertical divider between Sidebar ↔ File List
   - Vertical divider between File List ↔ Detail View
   - Horizontal divider between Commit List ↔ Diff Viewer (in detail panel)

2. **Resize Behavior**
   - **Cursor change**: Show resize cursor (`col-resize` / `row-resize`) on hover
   - **Min width**: Set minimum panel widths (e.g., 200px)
   - **Persist state**: Save panel sizes to localStorage
   - **Smooth drag**: Real-time resize while dragging

3. **Visual Feedback**
   - **Divider highlight** on hover (subtle gray)
   - **Dragging state**: Thicker divider or different color

## User Interactions

### File Operations

#### Stage/Unstage
- ☐ → ✅ Click checkbox to stage
- ✅ → ☐ Click checkbox to unstage
- **Batch**: "Stage All" / "Unstage All" buttons

#### View Diff
- Click file → Show diff in detail panel
- **Inline diff**: Line-by-line changes
- **Split view**: Side-by-side comparison

#### File Actions (Three-dot menu)
- **Open in Editor**
- **Reveal in Finder**
- **Copy Path**
- **Discard Changes** (for unstaged)
- **Unstage** (for staged)

### Commit Operations

#### Commit Flow
1. Stage files (checkbox selection)
2. Enter commit message (text area at bottom)
3. Click "Commit" button

#### Commit Message Input
- **Subject line** (50 chars, bold)
- **Body** (72 chars per line, expandable)
- **Character counter**
- **Amend checkbox**: Amend last commit

### Branch Operations

#### Switch Branch
- Click branch name in sidebar
- Confirm if there are uncommitted changes

#### Create Branch
- "+" button or right-click → "New Branch"
- **Branch name input**
- **Base branch selector**

#### Delete Branch
- Right-click → "Delete Branch"
- Confirm dialog

## Technical Implementation

### Frontend Components

```
RepositoryView/
├── Toolbar                 // Top toolbar with Git action buttons
├── ResizableLayout         // Three-panel container with draggable dividers
│   ├── Sidebar
│   │   ├── WorkspaceSection
│   │   │   ├── FileStatus    (uncommitted count)
│   │   │   └── Search
│   │   └── BranchesSection
│   │       ├── LocalBranches
│   │       └── RemoteBranches
│   ├── FileList
│   │   ├── FilterToolbar
│   │   ├── StagedFiles
│   │   └── UnstagedFiles
│   └── DetailPanel
│       ├── CommitHistory
│       └── DiffViewer
│           ├── FileSelector
│           └── DiffContent  (split/unified view)
└── CommitInput             // Bottom commit message area
```

### Backend API Needs

```rust
// Stage/Unstage
stage_file(path: String) -> Result<()>
unstage_file(path: String) -> Result<()>
stage_all() -> Result<()>
reset_all() -> Result<()>

// Commit
commit(message: String, amend: bool) -> Result<CommitInfo>

// Diff
get_file_diff(path: String, staged: bool) -> Result<DiffContent>
get_commit_diff(commit_id: String) -> Result<Vec<FileDiff>>

// Branch
get_branches() -> Result<BranchList>
switch_branch(name: String) -> Result<()>
create_branch(name: String, base: String) -> Result<()>
delete_branch(name: String) -> Result<()>
```

### State Management

- **Selected file**: Track current file for diff display
- **Staged/unstaged lists**: Sync with backend
- **Panel sizes**: Persist to localStorage
- **Commit message draft**: Auto-save to localStorage
- **Scroll positions**: Remember when switching files

## Design Notes

### Color Scheme
- **Staged file**: Blue checkbox
- **Added lines**: Light green background, dark green text
- **Deleted lines**: Light red background, dark red text
- **Modified**: Blue/yellow indicators
- **Branch highlight**: Blue accent
- **Current selection**: Blue highlight with white text

### Typography
- **Monospace**: Commit hash, file diff, line numbers
- **Sans-serif**: UI text, commit messages
- **Font sizes**:
  - File list: 13px
  - Diff viewer: 12px (monospace)
  - Commit message: 14px

### Spacing
- **Padding**: 8px-12px for list items
- **Line height**: 1.5 for diff lines
- **Divider width**: 1px (3px when hovered)
- **Icon size**: 16px-20px

## Accessibility

- **Keyboard shortcuts**:
  - `Space`: Stage/unstage selected file
  - `Cmd+Enter`: Commit
  - `Cmd+A`: Select all files
  - `↑/↓`: Navigate file list
  - `Tab`: Move between panels

- **Screen reader**: Announce file status changes
- **Focus indicators**: Clear visual focus states
- **Color contrast**: WCAG AA compliance

## Future Enhancements

- **Conflicts view**: Show merge conflicts with 3-way diff
- **Partial staging**: Stage individual hunks/lines
- **File tree view**: Group by folder hierarchy
- **Blame view**: Show git blame inline
- **Reflog**: Navigate git reflog
- **Tags**: Create and manage tags
- **Cherry-pick**: Cherry-pick commits
- **Interactive rebase**: Reorder/squash commits
