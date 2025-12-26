use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Repository configuration entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepositoryConfig {
    pub id: String,
    pub name: String,
    pub path: String,
    pub added_at: DateTime<Utc>,
    pub last_opened_at: Option<DateTime<Utc>>,
}

/// Application configuration
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct AppConfig {
    pub repositories: Vec<RepositoryConfig>,
}

impl AppConfig {
    /// Get the config directory path
    fn config_dir() -> Result<PathBuf, String> {
        dirs::home_dir()
            .map(|home| home.join(".prism"))
            .ok_or_else(|| "Cannot find home directory".to_string())
    }

    /// Get the config file path
    fn config_path() -> Result<PathBuf, String> {
        Self::config_dir().map(|dir| dir.join("repositories.json"))
    }

    /// Load configuration from file
    pub fn load() -> Result<Self, String> {
        let config_path = Self::config_path()?;

        if !config_path.exists() {
            return Ok(Self::default());
        }

        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Failed to read config: {}", e))?;

        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse config: {}", e))
    }

    /// Save configuration to file
    pub fn save(&self) -> Result<(), String> {
        let config_dir = Self::config_dir()?;
        let config_path = Self::config_path()?;

        // Create directory if it doesn't exist
        if !config_dir.exists() {
            fs::create_dir_all(&config_dir)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;

        fs::write(&config_path, content)
            .map_err(|e| format!("Failed to write config: {}", e))
    }

    /// Add a repository to the configuration
    pub fn add_repository(&mut self, name: String, path: String) -> RepositoryConfig {
        let repo = RepositoryConfig {
            id: Uuid::new_v4().to_string(),
            name,
            path,
            added_at: Utc::now(),
            last_opened_at: None,
        };
        self.repositories.push(repo.clone());
        repo
    }

    /// Remove a repository by ID
    pub fn remove_repository(&mut self, id: &str) -> bool {
        let len_before = self.repositories.len();
        self.repositories.retain(|r| r.id != id);
        self.repositories.len() != len_before
    }

    /// Update last opened time for a repository
    #[allow(dead_code)]
    pub fn update_last_opened(&mut self, id: &str) {
        if let Some(repo) = self.repositories.iter_mut().find(|r| r.id == id) {
            repo.last_opened_at = Some(Utc::now());
        }
    }

    /// Find repository by path
    pub fn find_by_path(&self, path: &str) -> Option<&RepositoryConfig> {
        self.repositories.iter().find(|r| r.path == path)
    }

    /// Check if repository is in the list
    pub fn contains_path(&self, path: &str) -> bool {
        self.find_by_path(path).is_some()
    }
}
