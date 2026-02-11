# Changelog

All notable changes to REMPO will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4-beta] - 2026-02-11

### Added

- **Core Electron Infrastructure**
  - Frameless window with custom title bar (Spotify-like aesthetic)
  - IPC communication layer between main and renderer processes
  - Persistent JSON store at `app.getPath("userData")/store.json`
  - System tray integration with "minimize to tray" option
  - AppUserModelID for Windows taskbar icon grouping
  - Window controls (minimize, maximize, close) via custom chrome

- **Repository Scanning**
  - Real-time folder scanning with progress updates via IPC events
  - Git repository detection using `simple-git` with CLI fallback
  - `.gitignore` pattern matching with the `ignore` package
  - Configurable scan depth, hidden files inclusion, and custom ignore patterns
  - Scan caching for instant access to previously scanned folders
  - "Restore last cache on launch" setting

- **AI Integration (Groq)**
  - Automatic commit summary generation using Groq API
  - Scroll-triggered lazy loading for AI summaries (first 8 repos, then on-demand)
  - AI settings panel with enable/disable toggle, API key storage, auto-summarize option
  - Graceful fallback when Groq SDK is unavailable

- **Terminal Integration**
  - Full xterm.js terminal embedded in the app (Ctrl+K shortcut)
  - Git command execution with output streaming
  - Command history (up/down arrows)
  - Terminal preferences (font size, cursor blink, dark/light theme)
  - Escape key to close terminal

- **Custom Folder Picker**
  - In-app directory browser replacing native folder dialogs
  - Quick access sidebar (Desktop, Downloads, Documents, Pictures, Music, Videos)
  - Recent folders list for quick re-selection
  - Drive list for Windows users
  - Breadcrumb navigation with back/up controls

- **Settings & Customization**
  - 9 themes: Light, Dark, Synthwave, Halloween, Aqua, Dracula, Caramellatte, Purple, Emerald
  - Notification settings with per-type toggles (scan completed, new commits, merge conflicts)
  - System settings: launch at startup, hardware acceleration, minimize to tray
  - Scan settings: max depth, include hidden, extra ignore patterns
  - Language selection (English, Spanish, French, German, Japanese, Chinese)
  - Cache management buttons (clear scan cache, AI summaries, activity log)

- **UI Components**
  - Sidebar with pinned folders and recent folders list
  - Dashboard with grid/list view modes
  - Project cards with status indicators (Clean, Uncommitted)
  - Project details drawer with commit history and file status
  - Activity sidebar showing recent actions
  - Settings modal with tabbed interface
  - Loading screen with logo animation
  - Welcome state for first-time users

- **Git Integration**
  - Repository status display (branch, last commit, clean/dirty status)
  - Commit history view (last 10 commits)
  - Changed files list with status indicators (added, modified, deleted)
  - "Open in Editor" button (VS Code, Cursor, or system default)
  - "View on GitHub" button with SSH-to-HTTPS URL conversion

- **GitHub Integration**
  - Bug report issue template (YAML form)
  - Feature request issue template (YAML form)
  - "Report a Bug" button linking to GitHub with template pre-selected
  - "Star on GitHub" quick action in About tab

- **Production Build Support**
  - Electron Forge configuration for packaging
  - Vite main process bundling with SSR mode
  - Optional dependency handling with fallbacks:
    - `simple-git` → Git CLI fallback
    - `ignore` → Manual pattern matching fallback
    - `groq-sdk` → AI disabled gracefully
    - `electron-squirrel-startup` → Silent continue
  - Asset bundling for images and icons
  - Icon resolution for both dev and packaged builds

### Changed

- Replaced native folder dialog with custom FolderPicker component
- Migrated from simulated scan progress to real-time IPC events
- Updated AI summarization from static to dynamic with IntersectionObserver
- Enhanced SettingsModal with functional controls (was previously placeholder UI)
- Improved window chrome to be frameless with custom controls

### Fixed

- Fixed broken image paths for logo in packaged builds
- Fixed missing module errors in packaged app by bundling dependencies
- Fixed icon not showing on Windows taskbar (added AppUserModelID)
- Fixed scanning returning 0 results by implementing Git CLI fallback
- Fixed `class` → `className` in React components

### Technical

- **Dependencies Added**: `xterm`, `xterm-addon-fit`, `simple-git`, `ignore`, `groq-sdk`, `lucide-react`, `sonner`, `@tailwindcss/vite`
- **Build Configuration**: Vite main config with `ssr.noExternal: true` for bundling
- **Architecture**: Proper IPC separation with contextIsolation and preload script
- **Error Handling**: Comprehensive try/catch with user-friendly error messages

## [0.0.1-alpha] - 2026-01-06

### Added

- Initial project setup with Electron Forge and Vite
- Basic React application structure
- Initial folder scanning (native dialog only)
- Basic repository display
- Simple theme switching (light/dark)
