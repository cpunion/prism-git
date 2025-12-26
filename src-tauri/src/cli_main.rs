//! Prism CLI - Lightweight command-line interface
//!
//! This binary:
//! 1. Checks if prism-gui is already running
//! 2. If running: sends the path via Unix socket and exits
//! 3. If not running: starts prism-gui in background and exits

use std::env;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

#[cfg(unix)]
use std::io::{Read, Write};
#[cfg(unix)]
use std::os::unix::net::UnixStream;

/// Get the socket path for IPC (Unix only)
#[cfg(unix)]
fn get_socket_path() -> PathBuf {
    dirs::runtime_dir()
        .or_else(|| dirs::cache_dir())
        .unwrap_or_else(|| PathBuf::from("/tmp"))
        .join("prism.sock")
}

/// Find the Git root directory (returns None if not in a git repo)
fn find_git_root(path: &Path) -> Option<PathBuf> {
    let mut current = if path.is_absolute() {
        path.to_path_buf()
    } else {
        env::current_dir().ok()?.join(path)
    };

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

/// Resolve path to absolute
fn resolve_path(path: &str) -> Option<PathBuf> {
    let p = Path::new(path);
    let resolved = if p.is_absolute() {
        p.to_path_buf()
    } else {
        env::current_dir().ok()?.join(p)
    };
    resolved.canonicalize().ok()
}

/// Try to send path to running instance (Unix only)
#[cfg(unix)]
fn send_to_running_instance(message: &str) -> Result<(), String> {
    let socket_path = get_socket_path();

    let mut stream = UnixStream::connect(&socket_path)
        .map_err(|e| format!("Cannot connect to running instance: {}", e))?;

    stream.set_write_timeout(Some(std::time::Duration::from_secs(2))).ok();
    stream.set_read_timeout(Some(std::time::Duration::from_secs(2))).ok();

    stream.write_all(message.as_bytes())
        .map_err(|e| format!("Failed to send message: {}", e))?;
    stream.write_all(b"\n")
        .map_err(|e| format!("Failed to send: {}", e))?;
    stream.flush()
        .map_err(|e| format!("Failed to flush: {}", e))?;

    let mut response = [0u8; 2];
    stream.read_exact(&mut response)
        .map_err(|e| format!("Failed to read response: {}", e))?;

    if &response == b"OK" {
        Ok(())
    } else {
        Err("Invalid response from server".to_string())
    }
}

/// Windows: always return error to start new instance
#[cfg(not(unix))]
fn send_to_running_instance(_message: &str) -> Result<(), String> {
    Err("IPC not supported on Windows".to_string())
}

/// Start the GUI process in background
fn start_gui(path: Option<&str>, is_git: bool) -> Result<(), String> {
    let current_exe = env::current_exe()
        .map_err(|e| format!("Cannot get current exe: {}", e))?;

    let gui_name = if cfg!(windows) { "prism-gui.exe" } else { "prism-gui" };
    let gui_path = current_exe.parent()
        .ok_or("Cannot get exe directory")?
        .join(gui_name);

    if !gui_path.exists() {
        return Err(format!("GUI binary not found: {}", gui_path.display()));
    }

    let mut cmd = Command::new(&gui_path);

    // Pass path and type as arguments
    if let Some(p) = path {
        cmd.arg(p);
        cmd.arg(if is_git { "git" } else { "dir" });
    }

    cmd.stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());

    #[cfg(unix)]
    {
        use std::os::unix::process::CommandExt;
        unsafe {
            cmd.pre_exec(|| {
                libc::setsid();
                Ok(())
            });
        }
    }

    cmd.spawn()
        .map_err(|e| format!("Failed to start GUI: {}", e))?;

    Ok(())
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let path_arg = args.get(1).map(|s| s.as_str());

    // Resolve the path
    let (resolved_path, is_git) = if let Some(p) = path_arg {
        if let Some(resolved) = resolve_path(p) {
            if resolved.is_dir() {
                // Check if it's a git repo
                let is_git = find_git_root(&resolved).is_some();
                (Some(resolved.to_string_lossy().to_string()), is_git)
            } else {
                eprintln!("Error: {} is not a directory", p);
                std::process::exit(1);
            }
        } else {
            eprintln!("Error: Cannot resolve path {}", p);
            std::process::exit(1);
        }
    } else {
        (None, false)
    };

    // Format message: "path|type" where type is "git" or "dir"
    let message = match &resolved_path {
        Some(p) => format!("{}|{}", p, if is_git { "git" } else { "dir" }),
        None => String::new(),
    };

    // Try to send to running instance
    match send_to_running_instance(&message) {
        Ok(()) => {
            if let Some(ref path) = resolved_path {
                if is_git {
                    println!("Opening {} in Prism...", path);
                } else {
                    println!("Opening {} (not a Git repository)...", path);
                }
            }
        }
        Err(_) => {
            match start_gui(resolved_path.as_deref(), is_git) {
                Ok(()) => {
                    if let Some(ref path) = resolved_path {
                        println!("Starting Prism with {}...", path);
                    } else {
                        println!("Starting Prism...");
                    }
                }
                Err(e) => {
                    eprintln!("Error: {}", e);
                    std::process::exit(1);
                }
            }
        }
    }
}
