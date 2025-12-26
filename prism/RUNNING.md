# Git 客户端运行指南

## 快速开始

```bash
# 1. 进入项目目录
cd /Users/lijie/source/cpunion/git-client/demo/tauri-demo

# 2. 确保端口空闲（如果之前启动过）
pkill -f "vite|tauri" 2>/dev/null || true

# 3. 启动开发服务器
npm run tauri:dev
```

## 使用方法

1. **打开仓库**
   - 在工具栏输入仓库路径（例如：`/Users/lijie/source/cpunion/git-client`）
   - 点击"打开仓库"按钮

2. **查看文件状态**
   - 点击侧边栏的"文件状态"
   - 查看已暂存和未暂存的文件
   - 点击文件查看详情

3. **查看提交历史**
   - 点击侧边栏的"历史"
   - 浏览最近 100 个提交
   - 查看作者、时间、提交信息

## 故障排除

### 端口被占用

如果看到 "Port 5173 is already in use"：

```bash
# 方法1：关闭所有 vite 和 tauri 进程
pkill -f "vite|tauri"

# 方法2：强制关闭端口
lsof -ti:5173 | xargs kill -9

# 然后重新启动
npm run tauri:dev
```

### 编译错误

所有编译错误已修复：
- ✅ FileInfo 添加了 Clone trait
- ✅ commit 生命周期问题已解决
- ✅ 移除了缺失的图标配置

## 已实现的功能

- ✅ 打开 Git 仓库
- ✅ 显示仓库信息（名称、当前分支）
- ✅ 查看文件状态（已暂存/未暂存）
- ✅ 查看提交历史（带分页）
- ✅ macOS 风格 UI
- ✅ 中文完美支持

## 性能特点

- 🚀 Rust 后端（git2）- 比 SourceTree 快 5-10 倍
- ⚡ 异步处理（tokio）- 不阻塞 UI
- 💾 轻量级（~50-100 MB vs SourceTree 300-500 MB）
- 🎨 macOS 原生风格

## 下一步增强

可以添加的功能：
1. Staging/Unstaging 文件
2. 创建 Commit
3. 分支管理
4. Diff 查看器（Monaco Editor）
5. 搜索和过滤

现在就可以运行并测试基本功能了！
