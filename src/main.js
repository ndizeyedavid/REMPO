const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  Notification,
  Tray,
  Menu,
} = require("electron");
const path = require("node:path");
let started = false;
try {
  started = require("electron-squirrel-startup");
} catch (e) {
  started = false;
}
const { exec, execFile } = require("child_process");
const fs = require("fs");
let Groq = null;
try {
  Groq = require("groq-sdk");
} catch (e) {
  Groq = null;
}

let simpleGit = null;
try {
  simpleGit = require("simple-git");
} catch (e) {
  simpleGit = null;
}
let ignore = null;
try {
  ignore = require("ignore");
} catch (e) {
  ignore = null;
}

const createIgnore = () => {
  if (ignore) return ignore();
  return {
    add: () => {},
    test: () => ({ ignored: false, unignored: false }),
  };
};

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
  settings: {
    ai: {
      enabled: true,
      autoSummarizeOnScan: true,
      verbosity: 70,
      provider: "groq",
      apiKey: "",
    },
    notifications: {
      enabled: true,
      scanCompleted: true,
      newCommitsDetected: true,
      mergeConflicts: true,
    },
    system: {
      openLastScannedFolderOnLaunch: true,
      restoreLastCacheOnLaunch: true,
      launchAtStartup: false,
      hardwareAcceleration: true,
      minimizeToTray: true,
    },
    terminal: {
      fontSize: 13,
      cursorBlink: true,
      theme: "dark",
    },
    scan: {
      maxDepth: 6,
      includeHidden: false,
      extraIgnorePatterns: [],
    },
    language: "English",
  },
};

const mergeStore = (data) => {
  if (!data || typeof data !== "object") return { ...DEFAULT_STORE };

  const merged = {
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
  };

  // Deep merge settings
  merged.settings = {
    ...DEFAULT_STORE.settings,
    ...(data.settings || {}),
    ai: {
      ...DEFAULT_STORE.settings.ai,
      ...(data.settings?.ai || {}),
    },
    notifications: {
      ...DEFAULT_STORE.settings.notifications,
      ...(data.settings?.notifications || {}),
    },
    system: {
      ...DEFAULT_STORE.settings.system,
      ...(data.settings?.system || {}),
    },
    terminal: {
      ...DEFAULT_STORE.settings.terminal,
      ...(data.settings?.terminal || {}),
    },
    scan: {
      ...DEFAULT_STORE.settings.scan,
      ...(data.settings?.scan || {}),
    },
  };

  return merged;
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

let tray = null;
let mainWindowRef = null;

const getIconPath = () => {
  const candidates = [
    // Packaged/built path (vite main build)
    path.join(__dirname, "..", "assets", "favicon.ico"),
    // Dev source path
    path.join(__dirname, "..", "..", "src", "assets", "favicon.ico"),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {}
  }
  return null;
};

const runGit = async (cwd, args) => {
  return await new Promise((resolve) => {
    execFile(
      "git",
      args,
      {
        cwd,
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          stdout: (stdout || "").toString(),
          stderr: (stderr || "").toString(),
          exitCode: typeof error?.code === "number" ? error.code : 0,
        });
      }
    );
  });
};

const isGitRepo = async (cwd) => {
  const res = await runGit(cwd, ["rev-parse", "--is-inside-work-tree"]);
  return res.ok && res.stdout.trim() === "true";
};

const ensureTray = () => {
  try {
    if (tray) return tray;
    if (
      process.platform !== "win32" &&
      process.platform !== "darwin" &&
      process.platform !== "linux"
    ) {
      return null;
    }

    const iconPath = getIconPath();
    if (!iconPath) return null;
    tray = new Tray(iconPath);
    tray.setToolTip("Rempo");

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show Rempo",
        click: () => {
          if (!mainWindowRef) return;
          try {
            mainWindowRef.show();
            mainWindowRef.focus();
          } catch (e) {}
        },
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);
    tray.on("double-click", () => {
      if (!mainWindowRef) return;
      try {
        mainWindowRef.show();
        mainWindowRef.focus();
      } catch (e) {}
    });

    return tray;
  } catch (e) {
    return null;
  }
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const iconPath = getIconPath();
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: iconPath || undefined,
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

  mainWindowRef = mainWindow;

  mainWindow.on("close", (e) => {
    try {
      const minimizeToTray = store.settings?.system?.minimizeToTray !== false;
      if (minimizeToTray) {
        e.preventDefault();
        ensureTray();
        mainWindow.hide();
      }
    } catch (err) {}
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

ipcMain.handle("get-home-dir", () => {
  try {
    return { ok: true, path: app.getPath("home") };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
});

ipcMain.handle("get-quick-access-paths", () => {
  try {
    const get = (key) => {
      try {
        return app.getPath(key);
      } catch (e) {
        return null;
      }
    };

    return {
      ok: true,
      paths: {
        desktop: get("desktop"),
        downloads: get("downloads"),
        documents: get("documents"),
        pictures: get("pictures"),
        music: get("music"),
        videos: get("videos"),
      },
    };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
});

ipcMain.handle("list-drives", () => {
  try {
    if (process.platform !== "win32") {
      return { ok: true, drives: [{ name: "/", path: "/" }] };
    }

    const drives = [];
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const p = `${letter}:\\`;
      try {
        if (fs.existsSync(p)) drives.push({ name: `${letter}:`, path: p });
      } catch (e) {}
    }

    return { ok: true, drives };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
});

ipcMain.handle("list-dir", async (_event, { dirPath }) => {
  try {
    if (!dirPath || typeof dirPath !== "string") {
      return { ok: false, error: "dirPath is required" };
    }

    let items;
    try {
      items = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (e) {
      return { ok: false, error: e?.message || String(e) };
    }

    const dirs = items
      .filter((d) => d.isDirectory())
      .map((d) => ({
        name: d.name,
        path: path.join(dirPath, d.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { ok: true, dirs };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
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

ipcMain.handle("generate-summary", async (event, { repoPath }) => {
  try {
    const aiSettings = store.settings?.ai;
    if (!aiSettings?.enabled || !aiSettings?.apiKey) {
      return { ok: false, error: "AI is disabled or API key is missing" };
    }

    if (!Groq) {
      return {
        ok: false,
        error:
          "AI module is missing in this build (groq-sdk). Please reinstall/update REMPO or rebuild with dependencies.",
      };
    }

    if (store.aiResponses[repoPath]) {
      return { ok: true, summary: store.aiResponses[repoPath] };
    }

    const groq = new Groq({ apiKey: aiSettings.apiKey });

    let fileList = "";
    let recentCommits = "";
    let branch = "";

    if (simpleGit) {
      const git = simpleGit(repoPath);
      const [status, log, br] = await Promise.all([
        git.status(),
        git.log({ maxCount: 5 }),
        git.revparse(["--abbrev-ref", "HEAD"]),
      ]);
      branch = String(br || "").trim();
      fileList = status.files
        .slice(0, 10)
        .map((f) => f.path)
        .join(", ");
      recentCommits = log.all.map((c) => c.message).join("\n");
    } else {
      const repoOk = await isGitRepo(repoPath);
      if (!repoOk) return { ok: false, error: "Not a git repository" };

      const [brRes, statusRes, logRes] = await Promise.all([
        runGit(repoPath, ["rev-parse", "--abbrev-ref", "HEAD"]),
        runGit(repoPath, ["status", "--porcelain"]),
        runGit(repoPath, ["log", "-n", "5", "--pretty=%s"]),
      ]);
      branch = brRes.ok ? brRes.stdout.trim() : "";
      fileList = statusRes.ok
        ? statusRes.stdout
            .split(/\r?\n/)
            .filter(Boolean)
            .slice(0, 10)
            .map((line) => line.slice(3).trim())
            .filter(Boolean)
            .join(", ")
        : "";
      recentCommits = logRes.ok ? logRes.stdout.trim() : "";
    }

    const prompt = `Summarize this git repository concisely (max 3 sentences).
Project Name: ${path.basename(repoPath)}
Current Branch: ${branch}
Recent Files: ${fileList}
Recent Commits:
${recentCommits}

Focus on the current state and purpose of the project.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 150,
    });

    const summary =
      chatCompletion.choices[0]?.message?.content || "No summary generated.";

    // Cache response
    store.aiResponses[repoPath] = summary;
    saveStore(store);

    return { ok: true, summary };
  } catch (error) {
    console.error("AI Summary Error:", error);
    return { ok: false, error: error.message };
  }
});

ipcMain.handle("scan-repos", async (event, rootPath, options) => {
  const repos = [];
  let foldersScanned = 0;
  let reposFound = 0;

  const scanSettings = {
    ...(store.settings?.scan || {}),
    ...(options && typeof options === "object" ? options : {}),
  };
  const maxDepth =
    typeof scanSettings.maxDepth === "number" && scanSettings.maxDepth > 0
      ? scanSettings.maxDepth
      : 6;
  const includeHidden = !!scanSettings.includeHidden;
  const extraIgnorePatterns = Array.isArray(scanSettings.extraIgnorePatterns)
    ? scanSettings.extraIgnorePatterns
    : [];

  let lastProgressSentAt = 0;
  const sendProgress = (force = false) => {
    const now = Date.now();
    if (!force && now - lastProgressSentAt < 60) return;
    lastProgressSentAt = now;
    try {
      event.sender.send("scan-progress", {
        folders: foldersScanned,
        repos: reposFound,
      });
    } catch (e) {}
  };

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
      const ig = createIgnore();
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

    const scanWithIgnore = async (currentDir, matcherStack, depth) => {
      if (depth > maxDepth) return;
      foldersScanned += 1;
      sendProgress();

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
        let statusLabel = "Clean";
        let branch = "";
        let lastCommit = "No commits";

        if (simpleGit) {
          const git = simpleGit(currentDir);
          const status = await git.status();
          const br = await git.revparse(["--abbrev-ref", "HEAD"]);
          const log = await git.log({ maxCount: 1 });
          statusLabel = status.files.length > 0 ? "Uncommitted" : "Clean";
          branch = String(br || "").trim();
          lastCommit = log.latest?.message || "No commits";
        } else {
          const repoOk = await isGitRepo(currentDir);
          if (!repoOk) return;

          const [statusRes, brRes, logRes] = await Promise.all([
            runGit(currentDir, ["status", "--porcelain"]),
            runGit(currentDir, ["rev-parse", "--abbrev-ref", "HEAD"]),
            runGit(currentDir, ["log", "-n", "1", "--pretty=%s"]),
          ]);
          const hasChanges = statusRes.ok && statusRes.stdout.trim().length > 0;
          statusLabel = hasChanges ? "Uncommitted" : "Clean";
          branch = brRes.ok ? brRes.stdout.trim() : "";
          lastCommit = logRes.ok
            ? logRes.stdout.trim() || "No commits"
            : "No commits";
        }

        repos.push({
          name: path.basename(currentDir),
          path: currentDir,
          status: statusLabel,
          branch,
          lastCommit,
          summary: "Repository found on disk.", // Placeholder for AI summary later
        });

        reposFound += 1;
        sendProgress(true);
        return; // Stop recursion if .git found
      }

      for (const file of files) {
        if (file === "node_modules") continue;
        if (!includeHidden && file.startsWith(".")) continue;

        const fullPath = path.join(currentDir, file);
        let stat;
        try {
          stat = fs.statSync(fullPath);
        } catch (e) {
          continue;
        }
        if (!stat.isDirectory()) continue;

        if (isIgnoredByStack(fullPath, true, nextStack)) continue;
        await scanWithIgnore(fullPath, nextStack, depth + 1);
      }
    };

    const extraIg = createIgnore();
    try {
      extraIg.add(
        extraIgnorePatterns
          .filter((p) => typeof p === "string" && p.trim())
          .join("\n")
      );
    } catch (e) {}

    const initialStack = extraIgnorePatterns.length
      ? [{ baseDir: dir, ig: extraIg }]
      : [];

    await scanWithIgnore(dir, initialStack, 0);
  };

  try {
    // Initial progress ping so UI doesn't stick at 0 while first disk read happens
    sendProgress(true);
    await scan(rootPath);
    // Final progress ping
    sendProgress(true);
    return repos;
  } catch (error) {
    console.error("Scan error:", error);
    return [];
  }
});

ipcMain.handle("get-repo-details", async (event, repoPath) => {
  try {
    if (simpleGit) {
      const git = simpleGit(repoPath);

      const log = await git.log({ maxCount: 10 });
      const commits = log.all.map((c) => ({
        id: c.hash.substring(0, 7),
        message: c.message,
        time: c.date,
        author: c.author_name,
      }));

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
    }

    const repoOk = await isGitRepo(repoPath);
    if (!repoOk) return { commits: [], files: [] };

    const [logRes, statusRes] = await Promise.all([
      runGit(repoPath, [
        "log",
        "-n",
        "10",
        "--pretty=%h|%an|%ad|%s",
        "--date=iso",
      ]),
      runGit(repoPath, ["status", "--porcelain"]),
    ]);

    const commits = logRes.ok
      ? logRes.stdout
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => {
            const [id, author, time, ...rest] = line.split("|");
            return {
              id: (id || "").trim(),
              author: (author || "").trim(),
              time: (time || "").trim(),
              message: rest.join("|").trim(),
            };
          })
      : [];

    const files = statusRes.ok
      ? statusRes.stdout
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => {
            const code = line.slice(0, 2);
            const name = line.slice(3).trim();
            const status = code.includes("A")
              ? "added"
              : code.includes("D")
                ? "deleted"
                : "modified";
            return { name, status };
          })
      : [];

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

ipcMain.handle("send-notification", (event, { title, body, type }) => {
  try {
    const notifications = store.settings?.notifications;
    if (notifications && notifications.enabled === false) return;

    if (type && notifications) {
      const typeMap = {
        scanCompleted: "scanCompleted",
        newCommitsDetected: "newCommitsDetected",
        mergeConflicts: "mergeConflicts",
      };
      const key = typeMap[type];
      if (key && notifications[key] === false) return;
    }

    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  } catch (e) {}
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
  try {
    if (process.platform === "win32") {
      app.setAppUserModelId("com.rempo.app");
    }
  } catch (e) {}
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
