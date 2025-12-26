// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cli;
mod config;
mod git_ops;
mod models;

use cli::find_git_root;
use config::{AppConfig, RepositoryConfig};
use models::*;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

// Unix-only imports for IPC
#[cfg(unix)]
use std::io::{BufRead, BufReader, Write};
#[cfg(unix)]
use std::os::unix::net::{UnixListener, UnixStream};
#[cfg(unix)]
use std::thread;

// Application state
struct AppState {
    config: Mutex<AppConfig>,
    initial_repo_path: Mutex<Option<String>>,
}

/// Get the socket path for IPC (Unix only)
#[cfg(unix)]
fn get_socket_path() -> PathBuf {
    dirs::runtime_dir()
        .or_else(|| dirs::cache_dir())
        .unwrap_or_else(|| PathBuf::from("/tmp"))
        .join("prism.sock")
}

/// Handle incoming connection from CLI (Unix only)
#[cfg(unix)]
fn handle_client(mut stream: UnixStream, app: AppHandle) {
    let cloned_stream = match stream.try_clone() {
        Ok(s) => s,
        Err(e) => {
            eprintln!("Failed to clone stream: {}", e);
            return;
        }
    };
    let reader = BufReader::new(cloned_stream);

    for line in reader.lines() {
        if let Ok(message) = line {
            let message = message.trim().to_string();

            // Send response
            let _ = stream.write_all(b"OK");
            let _ = stream.flush();

            // Parse message: "path|type" or empty
            if !message.is_empty() {
                let parts: Vec<&str> = message.splitn(2, '|').collect();
                let path = parts[0].to_string();
                let is_git = parts.get(1).map(|t| *t == "git").unwrap_or(true);

                // Emit event with path and type info
                let _ = app.emit("open-path", serde_json::json!({
                    "path": path,
                    "isGit": is_git
                }));
            }

            // Focus window
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
            }

            break;
        }
    }
}

/// Start IPC server to listen for CLI connections (Unix only)
#[cfg(unix)]
fn start_ipc_server(app: AppHandle) {
    let socket_path = get_socket_path();

    // Remove existing socket file
    let _ = std::fs::remove_file(&socket_path);

    // Create listener
    let listener = match UnixListener::bind(&socket_path) {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to create IPC socket: {}", e);
            return;
        }
    };

    // Set socket permissions
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = std::fs::set_permissions(&socket_path, std::fs::Permissions::from_mode(0o600));
    }

    // Accept connections in background thread
    thread::spawn(move || {
        for stream in listener.incoming() {
            if let Ok(stream) = stream {
                let app_clone = app.clone();
                thread::spawn(move || {
                    handle_client(stream, app_clone);
                });
            }
        }
    });
}

/// No-op IPC server for Windows
#[cfg(not(unix))]
fn start_ipc_server(_app: AppHandle) {
    // IPC via Unix sockets is not supported on Windows
    // TODO: Implement named pipes for Windows IPC
}

// Tauri 命令：打开仓库
#[tauri::command]
fn open_repo(path: String) -> Result<RepoInfo, String> {
    git_ops::open_repository(&path)
}

// Tauri 命令：获取提交历史
#[tauri::command]
async fn get_commits(
    path: String,
    limit: usize,
    offset: usize,
) -> Result<Vec<CommitInfo>, String> {
    tokio::task::spawn_blocking(move || git_ops::get_commit_history(&path, limit, offset))
        .await
        .map_err(|e| format!("Task error: {}", e))?
}

// Tauri 命令：获取文件状态
#[tauri::command]
async fn get_status(path: String) -> Result<FileStatusResponse, String> {
    tokio::task::spawn_blocking(move || git_ops::get_file_status(&path))
        .await
        .map_err(|e| format!("Task error: {}", e))?
}

// Tauri 命令：获取文件 diff
#[tauri::command]
async fn get_diff(path: String, file_path: String) -> Result<DiffResponse, String> {
    tokio::task::spawn_blocking(move || git_ops::get_file_diff(&path, &file_path))
        .await
        .map_err(|e| format!("Task error: {}", e))?
}

// Tauri 命令：查找 Git 仓库根目录
#[tauri::command]
fn find_repo_root(path: String) -> Result<String, String> {
    find_git_root(Path::new(&path))
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| format!("Not a Git repository: {}", path))
}

// Tauri 命令：检查是否为 Git 仓库
#[tauri::command]
fn check_is_git_repo(path: String) -> bool {
    cli::is_git_repository(Path::new(&path))
}

// Tauri 命令：初始化 Git 仓库
#[tauri::command]
fn init_repository(path: String) -> Result<(), String> {
    git2::Repository::init(&path)
        .map(|_| ())
        .map_err(|e| format!("Failed to initialize repository: {}", e))
}

// Tauri 命令：获取仓库列表
#[tauri::command]
fn get_repository_list(state: State<AppState>) -> Result<Vec<RepositoryConfig>, String> {
    let config = state.config.lock().map_err(|e| e.to_string())?;
    Ok(config.repositories.clone())
}

// Tauri 命令：添加仓库到列表
#[tauri::command]
fn add_repository(
    path: String,
    name: Option<String>,
    state: State<AppState>,
) -> Result<RepositoryConfig, String> {
    let mut config = state.config.lock().map_err(|e| e.to_string())?;

    if config.contains_path(&path) {
        return Err("Repository already in list".to_string());
    }

    let repo_name = name.unwrap_or_else(|| {
        Path::new(&path)
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "Unnamed".to_string())
    });

    let repo = config.add_repository(repo_name, path);
    config.save()?;
    Ok(repo)
}

// Tauri 命令：从列表移除仓库
#[tauri::command]
fn remove_repository(id: String, state: State<AppState>) -> Result<bool, String> {
    let mut config = state.config.lock().map_err(|e| e.to_string())?;
    let removed = config.remove_repository(&id);
    if removed {
        config.save()?;
    }
    Ok(removed)
}

// Tauri 命令：获取初始仓库路径
#[tauri::command]
fn get_initial_repo_path(state: State<AppState>) -> Option<String> {
    state.initial_repo_path.lock().ok().and_then(|guard| guard.clone())
}

fn main() {
    // Parse CLI arguments (for direct launch with path)
    let args: Vec<String> = std::env::args().collect();

    // Args: [exe, path, type] where type is "git" or "dir"
    let initial_path_info = if args.len() >= 2 {
        let path = &args[1];
        let is_git = args.get(2).map(|t| t == "git").unwrap_or(true);
        Some((path.clone(), is_git))
    } else {
        None
    };

    // Load configuration
    let config = AppConfig::load().unwrap_or_default();

    // Create application state
    let initial_repo_path = initial_path_info.as_ref().map(|(p, _)| p.clone());
    let state = AppState {
        config: Mutex::new(config),
        initial_repo_path: Mutex::new(initial_repo_path),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Start IPC server for CLI communication
            start_ipc_server(app.handle().clone());
            Ok(())
        })
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            open_repo,
            get_commits,
            get_status,
            get_diff,
            find_repo_root,
            check_is_git_repo,
            init_repository,
            get_repository_list,
            add_repository,
            remove_repository,
            get_initial_repo_path,
        ])
        .run(tauri::generate_context!())
        .expect("Error running Tauri application");
}
