# feat: Core Electron IPC Functionality & App Infrastructure

## Summary
Implements the foundational Electron infrastructure, IPC communication system, and core application features including real-time repository scanning, AI-powered summarization, custom terminal integration, and a built-in folder picker.

## Changes Included

### Core Electron Architecture
- **Frameless Window**: Custom title bar implementation for a modern, Spotify-like aesthetic
- **IPC Communication**: Full main-renderer process communication layer via `preload.js`
- **Persistent Storage**: JSON-based settings store at `app.getPath("userData")/store.json`

### Repository Scanning
- Real-time folder scanning with progress updates via IPC events
- Git repository detection using `simple-git` with CLI fallback
- `.gitignore` pattern matching with the `ignore` package
- Configurable scan depth, hidden files inclusion, and custom ignore patterns

### AI Integration (Groq)
- Automatic commit summary generation using Groq API
- Scroll-triggered lazy loading for AI summaries (first 8 repos, then on-demand)
- Configurable AI settings (enable/disable, API key storage, auto-summarize)

### Terminal Integration
- Full xterm.js terminal embedded in the app
- Git command execution with output streaming
- Terminal preferences (font size, cursor blink, theme)

### Custom Folder Picker
- In-app directory browser replacing native folder dialogs
- Quick access sidebar (Desktop, Downloads, Documents, Pictures, Music, Videos)
- Recent folders list for quick re-selection

### System Integration
- System tray support with "minimize to tray" option
- Launch at startup configuration
- Hardware acceleration toggle
- AppUserModelID for Windows taskbar icon grouping
