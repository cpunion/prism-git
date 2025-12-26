# Prism CLI 使用指南

## 安装

安装后，`prism` 命令将自动添加到系统 PATH。

## 基础用法

### 1. 打开仓库列表

```bash
prism
```

启动 Prism 并显示仓库列表窗口。

---

### 2. 打开指定仓库

```bash
prism <path>
```

直接打开指定路径的 Git 仓库，跳过仓库列表。

#### 示例

```bash
# 打开当前目录
prism .

# 打开指定目录
prism /Users/username/my-project

# 使用相对路径
prism ../other-project

# 使用波浪号（home 目录）
prism ~/projects/prism
```

---

## 高级功能

### 子目录自动定位

如果在仓库的子目录中运行 `prism .`，会自动向上查找并定位到仓库根目录。

```bash
# 在 prism/src/components 目录中
cd /Users/username/prism/src/components
prism .

# ✓ 自动定位到 /Users/username/prism
# → 打开 prism 仓库
```

---

### 非仓库目录

如果指定的路径不是 Git 仓库，会显示对话框：

```
┌──────────────────────────────────────┐
│ 不是有效的 Git 仓库                   │
├──────────────────────────────────────┤
│ 路径 "/path/to/dir" 不是一个         │
│ Git 仓库。                            │
│                                       │
│ 是否在此目录创建新的 Git 仓库？       │
├──────────────────────────────────────┤
│            [取消]  [创建仓库]         │
└──────────────────────────────────────┘
```

- **取消** - 关闭对话框，不执行任何操作
- **创建仓库** - 执行 `git init` 并打开仓库

---

### 添加到仓库列表

当通过命令行打开仓库时，如果该仓库不在列表中，会显示提示：

```
┌────────────────────────────────────────────┐
│ 💡 是否将此仓库添加到列表？                │
│    [添加]  [不再提示]  [×]                 │
└────────────────────────────────────────────┘
```

- **添加** - 将仓库添加到仓库列表并保存
- **不再提示** - 记住此仓库，以后不再询问
- **×** - 本次不添加，下次打开时仍会询问

---

## 常见用例

### 快速打开项目

```bash
# 在项目目录中
cd ~/projects/my-app
prism .
```

### 从任意位置打开

```bash
# 不需要先 cd
prism ~/projects/my-app
```

### 在终端中集成

配合其他命令使用：

```bash
# 克隆后立即打开
git clone https://github.com/user/repo.git
prism repo
```

### 快捷命令

在 shell 配置文件（如 `.zshrc` 或 `.bashrc`）中添加：

```bash
# 快速打开当前目录
alias p='prism .'

# 快速打开仓库列表
alias pl='prism'
```

使用：

```bash
# 在任意仓库目录中
p

# 打开列表
pl
```

---

## 错误处理

### 路径不存在

```bash
prism /nonexistent/path
```

```
❌ 错误
路径不存在：/nonexistent/path
```

### 权限不足

```bash
prism /root/protected-repo
```

```
❌ 权限错误
无法访问目录：/root/protected-repo
请检查文件权限
```

---

## 技术细节

### 仓库检测逻辑

1. 检查路径是否存在
2. 检查是否为目录
3. 从当前目录向上查找 `.git` 目录
4. 找到 `.git` 所在目录即为仓库根目录

### 路径规范化

- 相对路径转换为绝对路径
- 展开 `~` 为用户主目录
- 移除路径中的 `..` 和 `.`
- 规范化路径分隔符

---

## 平台差异

### macOS / Linux

```bash
prism /Users/username/project
prism ~/projects/app
```

### Windows

```powershell
prism C:\Users\username\project
prism ~\projects\app
```

---

## 与其他 Git 工具集成

### VS Code

在 VS Code 的 `settings.json` 中：

```json
{
  "terminal.integrated.shellArgs.osx": ["-l"],
  "prism.path": "/Applications/Prism.app/Contents/MacOS/prism"
}
```

### Git Hooks

在 `.git/hooks/post-commit` 中：

```bash
#!/bin/sh
prism . &
```

---

## 卸载

卸载 Prism 后，`prism` 命令将从系统中移除。
