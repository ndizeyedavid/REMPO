const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  Notification,
} = require("electron");
const path = require("node:path");
const started = require("electron-squirrel-startup");
const { exec, execFile } = require("child_process");
const fs = require("fs");
const pty = require("node-pty");
const simpleGit = require("simple-git");
const ignore = require("ignore");

// Data Store Setup
const STORE_PATH = path.join(app.getPath("userData"), "store.json");

const DEFAULT_STORE = {
  theme: "light",
  lastScannedFolder: null,
  watchedFolders: [],
  pinnedFolders: [],
  activities: [],
  // Keyed by absolute folder path: { [folderPath]: { scannedAt: number, repos: Repo[] } }
  scanCache: {},
  aiResponses: {},
  settings: {},
};

const mergeStore = (data) => {
  if (!data || typeof data !== "object") return { ...DEFAULT_STORE };

  return {
    ...DEFAULT_STORE,
    ...data,
    watchedFolders: Array.isArray(data.watchedFolders)
      ? data.watchedFolders
      : [],
    pinnedFolders: Array.isArray(data.pinnedFolders) ? data.pinnedFolders : [],
    activities: Array.isArray(data.activities) ? data.activities : [],
    scanCache:
      data.scanCache && typeof data.scanCache === "object"
        ? data.scanCache
        : {},
    aiResponses:
      data.aiResponses && typeof data.aiResponses === "object"
        ? data.aiResponses
        : {},
    settings:
      data.settings && typeof data.settings === "object" ? data.settings : {},
  };
};

const loadStore = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
      return mergeStore(parsed);
    }
  } catch (err) {
    console.error("Error loading store:", err);
  }

  return mergeStore(null);
};

const saveStore = (data) => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(mergeStore(data), null, 2));
  } catch (err) {
    console.error("Error saving store:", err);
  }
};

let store = loadStore();

const ptys = new Map();

const resolveGitBashPath = () => {
  const envPath = process.env.GIT_BASH_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  if (process.platform !== "win32") return null;

  const candidates = [
    path.join(process.env.ProgramFiles || "", "Git", "bin", "bash.exe"),
    path.join(process.env.ProgramFiles || "", "Git", "usr", "bin", "bash.exe"),
    path.join(process.env["ProgramFiles(x86)"] || "", "Git", "bin", "bash.exe"),
    path.join(
      process.env["ProgramFiles(x86)"] || "",
      "Git",
      "usr",
      "bin",
      "bash.exe"
    ),
    path.join(
      process.env.LocalAppData || "",
      "Programs",
      "Git",
      "bin",
      "bash.exe"
    ),
    path.join(
      process.env.LocalAppData || "",
      "Programs",
      "Git",
      "usr",
      "bin",
      "bash.exe"
    ),
  ].filter(Boolean);

  for (const c of candidates) {
    try {
      if (c && fs.existsSync(c)) return c;
    } catch (e) {}
  }

  return null;
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0b0b0b",
      symbolColor: "#ffffff",
      height: 48,
    },
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// IPC Handlers
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle("window-minimize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.handle("window-toggle-maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
  return win.isMaximized();
});

ipcMain.handle("window-close", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.handle("window-is-maximized", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return !!win?.isMaximized();
});

ipcMain.handle("pty-create", (event, { cwd, cols, rows }) => {
  const shellPath = resolveGitBashPath();
  if (!shellPath) {
    return {
      ok: false,
      error: "Git Bash not found. Set GIT_BASH_PATH env var to bash.exe.",
    };
  }

  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const p = pty.spawn(shellPath, ["--login", "-i"], {
    name: "xterm-256color",
    cols: typeof cols === "number" ? cols : 80,
    rows: typeof rows === "number" ? rows : 24,
    cwd: cwd && typeof cwd === "string" ? cwd : process.cwd(),
    env: { ...process.env },
  });

  p.onData((data) => {
    try {
      event.sender.send("pty-data", { id, data });
    } catch (e) {}
  });

  p.onExit(() => {
    ptys.delete(id);
    try {
      event.sender.send("pty-exit", { id });
    } catch (e) {}
  });

  ptys.set(id, p);
  return { ok: true, id };
});

ipcMain.handle("pty-write", (event, { id, data }) => {
  const p = ptys.get(id);
  if (!p) return;
  if (typeof data !== "string") return;
  p.write(data);
});

ipcMain.handle("pty-resize", (event, { id, cols, rows }) => {
  const p = ptys.get(id);
  if (!p) return;
  if (typeof cols !== "number" || typeof rows !== "number") return;
  p.resize(cols, rows);
});

ipcMain.handle("pty-dispose", (event, { id }) => {
  const p = ptys.get(id);
  if (!p) return;
  try {
    p.kill();
  } catch (e) {}
  ptys.delete(id);
});

ipcMain.handle("scan-repos", async (event, rootPath) => {
  const repos = [];

  const scan = async (dir) => {
    const toPosixRel = (baseDir, absolutePath, isDir) => {
      const rel = path
        .relative(baseDir, absolutePath)
        .split(path.sep)
        .join("/");
      if (!rel || rel.startsWith("..")) return null;
      return isDir ? `${rel}/` : rel;
    };

    const loadGitignore = (currentDir) => {
      const ig = ignore();
      try {
        const giPath = path.join(currentDir, ".gitignore");
        if (!fs.existsSync(giPath)) return ig;

        const raw = fs.readFileSync(giPath, "utf-8");
        ig.add(raw);
      } catch (e) {}
      return ig;
    };

    const isIgnoredByStack = (absolutePath, isDir, matcherStack) => {
      let ignored = false;

      for (const m of matcherStack) {
        const rel = toPosixRel(m.baseDir, absolutePath, isDir);
        if (!rel) continue;

        const res = m.ig.test(rel);
        if (res.ignored) ignored = true;
        if (res.unignored) ignored = false;
      }

      return ignored;
    };

    const scanWithIgnore = async (currentDir, matcherStack) => {
      const currentMatcher = {
        baseDir: currentDir,
        ig: loadGitignore(currentDir),
      };
      const nextStack = [...matcherStack, currentMatcher];

      let files;
      try {
        files = fs.readdirSync(currentDir);
      } catch (e) {
        return;
      }

      if (files.includes(".git")) {
        const git = simpleGit(currentDir);
        const status = await git.status();
        const branch = await git.revparse(["--abbrev-ref", "HEAD"]);
        const log = await git.log({ maxCount: 1 });

        repos.push({
          name: path.basename(currentDir),
          path: currentDir,
          status: status.files.length > 0 ? "Uncommitted" : "Clean",
          branch: branch,
          lastCommit: log.latest?.message || "No commits",
          summary: "Repository found on disk.", // Placeholder for AI summary later
        });
        return; // Stop recursion if .git found
      }

      for (const file of files) {
        if (file === "node_modules") continue;
        if (file.startsWith(".")) continue;

        const fullPath = path.join(currentDir, file);
        let stat;
        try {
          stat = fs.statSync(fullPath);
        } catch (e) {
          continue;
        }
        if (!stat.isDirectory()) continue;

        if (isIgnoredByStack(fullPath, true, nextStack)) continue;
        await scanWithIgnore(fullPath, nextStack);
      }
    };

    await scanWithIgnore(dir, []);
  };

  try {
    await scan(rootPath);
    return repos;
  } catch (error) {
    console.error("Scan error:", error);
    return [];
  }
});

ipcMain.handle("get-repo-details", async (event, repoPath) => {
  try {
    const git = simpleGit(repoPath);

    // Get recent commits
    const log = await git.log({ maxCount: 10 });
    const commits = log.all.map((c) => ({
      id: c.hash.substring(0, 7),
      message: c.message,
      time: c.date,
      author: c.author_name,
    }));

    // Get changed files (working directory status)
    const status = await git.status();
    const files = status.files.map((f) => ({
      name: f.path,
      status:
        f.index === "A" || f.working_dir === "A"
          ? "added"
          : f.index === "D" || f.working_dir === "D"
            ? "deleted"
            : "modified",
    }));

    return { commits, files };
  } catch (error) {
    console.error("Failed to fetch repo details:", error);
    return { commits: [], files: [] };
  }
});

ipcMain.handle(
  "commit-and-push",
  async (event, { repoPath, branchName, commitMessage }) => {
    try {
      const git = simpleGit(repoPath);

      // 1. Create and checkout new branch
      await git.checkoutLocalBranch(branchName);

      // 2. Add all changes
      await git.add(".");

      // 3. Commit
      await git.commit(commitMessage);

      // 4. Push to origin head
      await git.push("origin", branchName, ["--set-upstream"]);

      return { success: true };
    } catch (error) {
      console.error("Git operation failed:", error);
      return { success: false, error: error.message };
    }
  }
);

ipcMain.handle("get-remote-url", async (event, repoPath) => {
  try {
    const git = simpleGit(repoPath);
    const remotes = await git.getRemotes(true);
    const origin = remotes.find((r) => r.name === "origin") || remotes[0];
    if (!origin) return null;

    let url = origin.refs.fetch || origin.refs.push;
    // Convert SSH URL to HTTPS for browser opening
    if (url.startsWith("git@github.com:")) {
      url = url
        .replace("git@github.com:", "https://github.com/")
        .replace(/\.git$/, "");
    } else if (url.endsWith(".git")) {
      url = url.replace(/\.git$/, "");
    }
    return url;
  } catch (error) {
    console.error("Failed to get remote URL:", error);
    return null;
  }
});

ipcMain.handle("open-in-browser", async (event, url) => {
  if (url) {
    shell.openExternal(url);
  }
});

ipcMain.handle("send-notification", (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

ipcMain.handle("run-git-command", async (event, { cwd, args }) => {
  try {
    if (!cwd || typeof cwd !== "string") {
      return { ok: false, stdout: "", stderr: "Missing cwd", exitCode: 1 };
    }
    if (!Array.isArray(args) || args.some((a) => typeof a !== "string")) {
      return { ok: false, stdout: "", stderr: "Invalid args", exitCode: 1 };
    }

    // Verify we're inside a git work tree
    const isRepo = await new Promise((resolve) => {
      execFile(
        "git",
        ["rev-parse", "--is-inside-work-tree"],
        { cwd, timeout: 8000 },
        (err, stdout) => {
          if (err) return resolve(false);
          resolve(stdout.toString().trim() === "true");
        }
      );
    });

    if (!isRepo) {
      return {
        ok: false,
        stdout: "",
        stderr: "Not a git repository",
        exitCode: 1,
      };
    }

    const result = await new Promise((resolve) => {
      execFile(
        "git",
        args,
        {
          cwd,
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024,
        },
        (error, stdout, stderr) => {
          const exitCode = typeof error?.code === "number" ? error.code : 0;
          resolve({
            ok: !error,
            stdout: (stdout || "").toString(),
            stderr:
              (stderr || "").toString() ||
              (error?.message ? String(error.message) : ""),
            exitCode,
          });
        }
      );
    });

    return result;
  } catch (error) {
    return {
      ok: false,
      stdout: "",
      stderr: String(error?.message || error),
      exitCode: 1,
    };
  }
});

ipcMain.handle("open-in-editor", async (event, repoPath) => {
  // Try common editors or use system default
  const editors = ["code", "cursor", "subl"];
  for (const cmd of editors) {
    try {
      exec(`${cmd} "${repoPath}"`);
      return true;
    } catch (e) {}
  }
  return shell.openPath(repoPath);
});

// Store Handlers
ipcMain.handle("get-store", () => store);

ipcMain.handle("update-store", (event, key, value) => {
  store[key] = value;
  saveStore(store);
  return store;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
