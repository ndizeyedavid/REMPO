# REMPO

> **Re**member what you were building. A beautiful dashboard for your global git ecosystem.

[![Version](https://img.shields.io/badge/version-1.0.4--beta-blue)](https://github.com/ndizeyedavid/REMPO/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Electron](https://img.shields.io/badge/built%20with-Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/built%20with-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

![REMPO Screenshot](public/favicon.ico)

## Overview

REMPO is a sleek, modern desktop application built with Electron and React that helps developers manage and visualize their Git repositories across their entire file system. With AI-powered summaries, a built-in terminal, and a beautiful UI, REMPO makes it easy to keep track of what you were building.

## Features

### Core Functionality

- **Global Repository Scanning** - Automatically discover all Git repositories in any folder
- **Real-time Progress** - Live scan progress with folder and repository counters
- **Smart Caching** - Cached scan results for instant access to previously scanned folders
- **Custom Folder Picker** - Built-in directory browser with quick access to common folders (Desktop, Downloads, Documents, etc.)

### Git Integration

- **Repository Status** - See branch, commit status, and uncommitted changes at a glance
- **Commit History** - View recent commits with author and timestamp information
- **Built-in Terminal** - xterm.js-powered Git terminal (Ctrl+K to open)
- **One-click Actions** - Open repos in VS Code, view on GitHub, or open in file explorer

### AI-Powered Insights

- **Automatic Summarization** - AI-generated summaries of your repositories using Groq
- **Lazy Loading** - Summaries generate on-demand as you scroll
- **Configurable** - Toggle AI features, set API key, and control verbosity

### Customization

- **9 Beautiful Themes** - Light, Dark, Synthwave, Halloween, Aqua, Dracula, Caramellatte, Purple, Emerald
- **Terminal Preferences** - Font size, cursor blink, theme settings
- **Scan Options** - Configure max depth, hidden folders, and ignore patterns
- **Notification Settings** - Control which events trigger desktop notifications

### System Integration

- **Minimize to Tray** - Keep REMPO running in the system tray
- **Launch at Startup** - Optional auto-start with Windows
- **Custom Window Chrome** - Frameless window with custom title bar
- **Windows Taskbar** - Proper icon grouping with AppUserModelID

## Installation

### Download

Download the latest release from the [Releases](https://github.com/ndizeyedavid/REMPO/releases) page.

### Build from Source

```bash
# Clone the repository
git clone https://github.com/ndizeyedavid/REMPO.git
cd REMPO

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run make
```

## Usage

### Getting Started

1. Launch REMPO
2. Click **"Scan Projects"** or press the folder icon
3. Select a folder to scan (or use the custom folder picker)
4. Watch as REMPO discovers all your Git repositories!

### Keyboard Shortcuts

| Shortcut | Action                    |
| -------- | ------------------------- |
| `Ctrl+K` | Open Git Terminal Palette |
| `Esc`    | Close modals/terminal     |

### Settings

Access settings from the sidebar to customize:

- **Personalization** - Change themes
- **AI Configuration** - Enable/disable AI, set Groq API key
- **Languages** - UI language selection
- **Notifications** - Configure desktop alerts
- **System** - Startup behavior, hardware acceleration, tray options
- **About** - App info, bug reporting, developer credits

## Tech Stack

- **Electron** - Cross-platform desktop framework
- **React 19** - UI library with hooks
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **daisyUI** - Tailwind component library
- **xterm.js** - Terminal emulator
- **simple-git** - Git operations (with CLI fallback)
- **Groq SDK** - AI summarization
- **Electron Forge** - Packaging and distribution

## Project Structure

```
REMPO/
├── App/                      # React application
│   ├── components/           # React components
│   │   ├── Sidebar.jsx       # Main navigation sidebar
│   │   ├── Header.jsx        # Window title bar (custom chrome)
│   │   ├── SettingsModal.jsx # Settings interface
│   │   ├── FolderPicker.jsx  # Custom directory picker
│   │   ├── GitPalette.jsx    # Terminal component
│   │   ├── DashboardState.jsx # Main repo grid view
│   │   ├── ProjectCard.jsx   # Repository card component
│   │   └── ...
│   └── App.jsx               # Main app component
├── src/                      # Electron main process
│   ├── main.js               # Main process entry
│   ├── preload.js            # Preload script (IPC bridge)
│   └── assets/               # Icons and images
├── public/                   # Static assets
├── .github/                  # GitHub templates and workflows
│   └── ISSUE_TEMPLATE/       # Bug report and feature request templates
├── index.html                # Renderer entry HTML
├── forge.config.js           # Electron Forge configuration
└── vite.*.config.mjs         # Vite configurations
```

## Configuration

### Data Storage

REMPO stores all data in a JSON file at:

- **Windows**: `%APPDATA%/Rempo/store.json`
- **macOS**: `~/Library/Application Support/Rempo/store.json`
- **Linux**: `~/.config/Rempo/store.json`

### AI Setup (Optional)

To enable AI-powered repository summaries:

1. Get a free API key from [groq.com](https://groq.com)
2. Open Settings → AI Configuration
3. Paste your API key and enable AI features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Reporting Issues

Found a bug? Please use our [Bug Report Template](https://github.com/ndizeyedavid/REMPO/issues/new?template=bug_report.yml) to create a detailed issue.

Have a feature idea? Use our [Feature Request Template](https://github.com/ndizeyedavid/REMPO/issues/new?template=feature_request.yml).

## Developer

**David NDIZEYE**

- GitHub: [@ndizeyedavid](https://github.com/ndizeyedavid)
- Portfolio: [davidndizeye.vercel.app](https://davidndizeye.vercel.app)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with passion and a lot of ☕
- Thanks to the Electron, React, and Tailwind communities
- Icons by [Lucide](https://lucide.dev/)

---

<p align="center">
  <sub>Built with ❤️ by David NDIZEYE | &copy; 2026 REMPO</sub>
</p>
