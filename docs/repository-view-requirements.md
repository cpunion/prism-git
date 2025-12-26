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
            ├── Commits      // Commit history list (Conditional)
            └── Row (Horizontal)
                ├── Column (Vertical)
                │   ├── FileList    // Mode A: Staged/Unstaged, Mode B: Commit Changes
                └── FileDiff        // Diff viewer
```

**Key Feature**: All dividers between components are **draggable/resizable**

---

## 1. Sidebar Interactions & View Modes

### View: "File Status" (Workspace)
- **Action**: Selecting "File Status" in sidebar.
- **Layout**:
  - **Commits Panel**: **HIDDEN**
  - **FileList Panel**: Detailed Staged/Unstaged split view (Working Copy).
  - **DiffView**: Interaction linked to files in FileList.

### View: "History" (Workspace)
- **Action**: Selecting "History" in sidebar.
- **Layout**:
  - **Commits Panel**: **VISIBLE**
  - **FileList Panel**: Depends on selection in Commits Panel.

#### Commits Panel features:
- **"Uncommitted Changes" Row**:
  - Appears at the very top of the list if (and only if) there are detected changes in the working directory.
  - **Clicking it**: Shows Staged/Unstaged view in FileList (same as "File Status" view).
- **Commit Row**:
  - **Clicking it**: Shows "Commit Files" view in FileList (flat list of changed files).

---

## 2. File List Modes

### Mode A: Working Copy (Staged/Unstaged)
*(Used when "File Status" is active OR "Uncommitted Changes" row is selected in History)*

```
Column (Vertical)
├── Staged Files    (resizable)
└── Unstaged Files  (resizable)
```
- **Actions**: Stage/Unstage checkboxes, Discard, etc.

### Mode B: Commit Changes
*(Used when a specific Commit is selected in History)*

```
Column (Vertical)
└── Changed Files List
```
- **Content**: List of files modified in that commit.
- **Actions**: View file, Restore file (maybe), etc. No checkboxes for staging.

---

## [Rest of the document remains similar]
