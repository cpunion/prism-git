# Git 客户端 - AI 图像生成提示词

> 用于 Midjourney、DALL-E、Stable Diffusion 等 AI 工具生成 UI 设计稿

## 1. 整体界面

### 提示词 1：主界面全览
```
A modern macOS Git client application interface in light mode, clean and minimalist design. Three-column layout: left sidebar (220px) with navigation menu in light gray (#F5F5F7), center main content area showing commit history list, right panel (400px) showing code diff viewer. Top toolbar (52px) with repository path and action buttons. Use SF Pro font, macOS Big Sur style, rounded corners (6px), subtle shadows, #007AFF accent color for interactive elements. Professional, clean, high-fidelity UI mockup. --ar 16:9 --style modern
```

### 提示词 2：深色模式主界面
```
Same Git client interface in macOS dark mode. Dark background (#1E1E1E), sidebar in dark gray (#2C2C2E), white text, blue accent (#007AFF), high contrast, professional developer tool aesthetic. Commit graph with colored branch lines, file status indicators, Monaco editor for diff view. --ar 16:9 --style modern
```

## 2. 侧边栏详细设计

### 提示词 3：侧边栏组件
```
macOS style sidebar for Git client, 220px width, light background (#F5F5F7). Sections: "工作区" with file status icon and badge showing "3", "历史" with clock icon, "分支" section with branch list. Section titles in gray (#8E8E93), 11px uppercase. Selected item has blue background (#007AFF) with white text. Hover state with subtle gray (#00000008). Icons 16x16px. SF Pro Text font. High-fidelity mockup. --ar 9:16
```

### 提示词 4：分支列表
```
Detailed branch list in Git client sidebar. Show local branches: "main" (current, blue dot), "feature/new-ui", "hotfix/bug-123". Remote branches section below with "origin/main", "origin/develop". Each branch with git branch icon (🌿), 13px text, indented tree structure. Current branch highlighted in bold with checkmark. Right-click menu visible. --ar 9:16
```

## 3. 文件状态面板

### 提示词 5：文件状态列表
```
Git file status panel in macOS style. Two sections: "未暂存的文件 (5)" and "已暂存的文件 (2)". Each file item shows status badge (M=orange, A=green, D=red), file path in monospace font, status text in gray. White background, list items 48px height, 1px border between items (#F0F0F0). Hover state with light gray background. File icons for different types. --ar 3:4
```

### 提示词 6：文件状态图标
```
File status badges for Git client. Circular 20x20px badges with rounded corners (4px):
- "A" badge: green circle (#34C759) with white letter
- "M" badge: orange circle (#FF9500) with white letter
- "D" badge: red circle (#FF3B30) with white letter
- "R" badge: blue circle (#5AC8FA) with white letter
Clean, vector style, high contrast. --ar 1:1
```

## 4. 提交历史

### 提示词 7：提交历史列表
```
Git commit history list in modern macOS app. Each commit item shows: commit hash in gray badge (e.g. "a1b2c3d"), author name, timestamp, commit message. Left side shows branch graph with colored lines (blue, green, purple) connecting commits. Avatar circle 32px, commits 60px height, alternating subtle background. Monaco editor aesthetic. --ar 3:4
```

### 提示词 8：分支图可视化
```
Git branch visualization graph, left side of commit list. Colored lines (blue #007AFF, green #34C759, purple #AF52DE) showing branch topology. Merge points with dots, branch splits, vertical timeline. Smooth curves for merges, 4px line width, clean vector style. Light background, professional look. --ar 9:16
```

## 5. Diff 查看器

### 提示词 9：代码 Diff 视图
```
Code diff viewer in Monaco Editor style. Split view showing old (left) and new (right) code. Line numbers in gray, added lines with light green background (#E6FFEC), deleted lines with light red background (#FFE6E6). Syntax highlighting for JavaScript. Line-by-line comparison, 13px monospace font (SF Mono), scroll sync between panels. Professional code editor aesthetic. --ar 16:9
```

### 提示词 10：Inline Diff 视图
```
Inline diff view showing unified diff format. Red lines (deletions) with minus sign, green lines (additions) with plus sign, context lines in default color. Syntax highlighting, line numbers, fold indicators. macOS scrollbar, clean padding. SF Mono font, dark on light, professional. --ar 3:4
```

## 6. 工具栏和按钮

### 提示词 11：顶部工具栏
```
macOS style toolbar for Git client, 52px height. Left side: repository path text input with folder icon. Center: current branch badge "main" with branch icon. Right side: action buttons "Pull", "Push", "Fetch", "Commit" in blue (#007AFF). Subtle bottom border, light background (#F5F5F7). Clean, professional. --ar 16:3
```

### 提示词 12：按钮组件
```
Button components for Git client: Primary button (blue #007AFF, white text, 6px rounded), Secondary button (border only, transparent), Text button (no background). Various sizes: small (24px), medium (28px), large (32px). Hover states shown. SF Pro Text font, macOS style. --ar 16:9
```

## 7. 对话框和面板

### 提示词 13：Commit 对话框
```
Commit dialog modal in macOS style. Title "新建提交", textarea for commit message with placeholder "输入提交信息...", file list below showing staged files with checkboxes. Bottom buttons: "取消" (gray), "提交" (blue). White background, rounded corners (12px), subtle shadow. 600px width. --ar 4:5
```

### 提示词 14：设置面板
```
Settings panel with tabs: "常规", "账户", "外观", "快捷键". Form fields with labels, text inputs, checkboxes, dropdowns. macOS native controls style, clean spacing, SF Pro font. Light mode, organized sections with subtle dividers. --ar 4:5
```

## 8. 状态和反馈

### 提示词 15：加载状态
```
Loading states for Git client: Skeleton loaders for commit list (pulsing gray rectangles), progress bar for clone operation (blue progress), spinner for background operations. macOS style, subtle animations suggested. Clean, minimal. --ar 16:9
```

### 提示词 16：通知提示
```
Toast notifications in macOS style: Success (green checkmark), Error (red X), Info (blue i), Warning (yellow !). Rounded rectangles, 400px width, slide in from top-right. Icon + message + close button. Subtle shadow, backdrop blur. --ar 16:9
```

## 9. 空状态

### 提示词 17：空仓库状态
```
Empty state illustration for Git client when no repository is open. Center of screen: folder icon (64px), title "未打开仓库", description "选择一个 Git 仓库以开始", primary button "打开仓库". Light background, centered layout, friendly and minimal. --ar 4:3
```

### 提示词 18：无提交历史
```
Empty state for commit history: clock icon, "暂无提交历史" title, subtle illustration of git commits. Encouraging message below. Clean, minimal, professional. --ar 4:3
```

## 10. 图标集

### 提示词 19：应用图标
```
Application icon for Git client. Simplified stylized "G" letter in modern sans-serif, gradient from dark slate (#4A5568) to blue-purple (#6366F1). Clean, minimalist, professional. macOS Big Sur style with depth and subtle shadow. 512x512px, suitable for app icon. --ar 1:1
```

### 提示词 20：功能图标集
```
Icon set for Git client in SF Symbols style, 20x20px: repository folder, branch, commit, pull, push, merge, tag, stash, search, settings, refresh. Monochrome, stroke-based, 2px line weight, professional. Clean vector style. --ar 16:9
```

## 使用说明

### 1. 针对不同 AI 工具的调整

**Midjourney:**
- 保留 `--ar` 参数
- 添加 `--v 6` 使用最新版本
- 添加 `--style raw` 获得更真实的 UI 效果

**DALL-E 3:**
- 移除所有 `--` 参数
- 强调 "photorealistic UI mockup"
- 添加 "high resolution, detailed"

**Stable Diffusion:**
- 添加质量标签：`(best quality:1.2), (detailed:1.2)`
- 添加负面提示：`(low quality:0.8), (blurry:0.8)`
- 使用 UI 专用模型如 Protogen

### 2. 提示词优化建议

- 明确指定颜色代码（#007AFF）
- 包含具体尺寸（px）
- 说明交互状态（hover, active）
- 指定字体（SF Pro）
- 强调风格（macOS, modern, clean）

### 3. 后处理

生成后可能需要：
- Figma 中重绘以保证精确度
- 调整颜色以符合设计规范
- 统一字体和间距
- 添加真实内容替换占位符
