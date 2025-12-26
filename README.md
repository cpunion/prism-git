# Prism

A fast, native Git client built with Tauri, React, and Rust.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://github.com/cpunion/prism-git/actions/workflows/ci.yml/badge.svg)

## Features

- 🚀 **Fast Performance** - Native Rust backend with git2 library
- 🖥️ **Multi-Window** - Each repository opens in its own window
- 📋 **Repository List** - Manage all your repositories in one place
- 🔄 **Single Instance** - CLI opens repos in running instance
- 🎨 **SourceTree-inspired UI** - Familiar and intuitive interface

## Screenshots

*(Coming soon)*

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/cpunion/prism-git.git
cd prism-git/prism

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build for production
npm run tauri:build
```

### Requirements

- Node.js 18+
- Rust 1.70+
- macOS 10.15+ / Windows 10+ / Linux

## CLI Usage

```bash
# Open repository list
prism

# Open a specific repository
prism /path/to/repo

# Open current directory
prism .
```

When a Prism instance is already running, the CLI sends the path to the existing instance and exits.

## Project Structure

```
prism/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Button, Badge, Input, Tabs
│   │   ├── git/            # RepoIcon, BranchBadge, FileStatusBadge
│   │   └── layout/         # Sidebar, Toolbar
│   ├── views/              # Page components
│   │   ├── RepositoryList/ # Main repository list
│   │   └── Repository/     # Repository detail view
│   ├── api/                # Tauri command wrappers
│   └── styles/             # CSS variables and global styles
└── src-tauri/              # Rust backend
    ├── src/
    │   ├── main.rs         # Tauri app with IPC server
    │   ├── cli_main.rs     # CLI binary
    │   ├── git_ops.rs      # Git operations
    │   └── config.rs       # Configuration persistence
    └── capabilities/       # Tauri permissions
```

## Development

```bash
# Run tests
npm run test

# Run Storybook for component development
npm run storybook

# Build Rust backend only
cargo build --manifest-path src-tauri/Cargo.toml
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Rust, Tauri 2, git2
- **Testing**: Vitest, React Testing Library
- **UI Development**: Storybook

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - see [LICENSE](LICENSE) for details.
