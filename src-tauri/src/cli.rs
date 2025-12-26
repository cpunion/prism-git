use clap::Parser;
use std::path::{Path, PathBuf};

/// Prism - A fast Git client
#[derive(Parser, Debug)]
#[command(name = "prism")]
#[command(about = "A fast Git client", long_about = None)]
pub struct Cli {
    /// Path to repository (optional)
    pub path: Option<String>,
}

impl Cli {
    pub fn parse_args() -> Self {
        Self::parse()
    }

    /// Get the resolved repository path
    pub fn get_repo_path(&self) -> Option<PathBuf> {
        self.path.as_ref().map(|p| {
            let path = PathBuf::from(p);
            if path.is_absolute() {
                path
            } else {
                std::env::current_dir()
                    .map(|cwd| cwd.join(&path))
                    .unwrap_or(path)
            }
        })
    }
}

/// Find the Git root directory by walking up from the given path
pub fn find_git_root(path: &Path) -> Option<PathBuf> {
    let mut current = if path.is_absolute() {
        path.to_path_buf()
    } else {
        std::env::current_dir()
            .ok()?
            .join(path)
    };

    // Canonicalize to resolve symlinks and ..
    current = current.canonicalize().ok()?;

    loop {
        if current.join(".git").exists() {
            return Some(current);
        }

        match current.parent() {
            Some(parent) => current = parent.to_path_buf(),
            None => return None,
        }
    }
}

/// Check if a path is a valid Git repository
pub fn is_git_repository(path: &Path) -> bool {
    find_git_root(path).is_some()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_git_root_current_dir() {
        // This test assumes we're running from within a git repo
        let current = std::env::current_dir().unwrap();
        let result = find_git_root(&current);
        assert!(result.is_some());
    }
}
