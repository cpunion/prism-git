# Prism - Git 客户端项目文档

一个比 SourceTree 更快、更轻量的 Git 客户端

## 📚 文档索引

### 核心文档

1. **[功能需求](./requirements.md)** - 完整的功能需求列表，基于 SourceTree
2. **[UI 设计规范](./ui-design.md)** - macOS 风格的视觉设计系统
3. **[技术架构](./architecture.md)** - Tauri + Rust + React 技术栈
4. **[UI 生成提示词](./ui-prompts.md)** - 用于 AI 工具生成界面设计稿

### 快速开始

#### 阅读顺序建议

1. **产品经理/设计师**：
   - requirements.md → ui-design.md → ui-prompts.md

2. **开发工程师**：
   - architecture.md → requirements.md → ui-design.md

3. **UI 设计**：
   - ui-design.md → ui-prompts.md

#### 使用 AI 生成 UI

参考 `ui-prompts.md`，使用以下工具：
- Midjourney
- DALL-E 3
- Stable Diffusion

## 🎯 项目目标

**Prism** - 创建一个比 SourceTree 更快、更轻量、更现代的 Git 客户端。

### 核心优势

| 特性 | SourceTree | Prism |
|------|-----------|--------|
| **性能** | 中等 | 快 5-10 倍 |
| **包体积** | 100+ MB | 2-5 MB |
| **跨平台** | 分别开发 | 统一代码 |
| **UI** | 平台各异 | 可控一致 |
| **技术栈** | C#/Obj-C | Rust/React |

## 📊 开发计划

### Phase 1: MVP（4周）
- [x] 打开仓库
- [x] 文件状态查看
- [ ] Stage/Unstage
- [ ] 创建 Commit
- [ ] 提交历史
- [ ] 基础 Diff

### Phase 2: 完整功能（8周）
- [ ] 分支管理
- [ ] Pull/Push/Fetch
- [ ] 分支图展示
- [ ] 搜索过滤
- [ ] Monaco Editor Diff

### Phase 3: 高级功能（12周）
- [ ] Stash
- [ ] Rebase
- [ ] Conflict 解决
- [ ] Submodule
- [ ] 性能优化

## 🛠️ 技术栈

- **后端**: Rust + git2 + tokio
- **前端**: React + TypeScript + Vite
- **框架**: Tauri 2.1
- **编辑器**: Monaco Editor

## 📖 相关资源

- [Tauri 官方文档](https://tauri.app)
- [git2-rs 文档](https://docs.rs/git2)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [macOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 🤝 贡献指南

1. 阅读相关文档
2. 遵循设计规范
3. 编写测试
4. 提交 PR

## 📝 许可证

MIT License
