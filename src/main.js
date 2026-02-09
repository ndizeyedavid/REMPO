const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("node:path");
const started = require("electron-squirrel-startup");
const { exec } = require("child_process");
const fs = require("fs");
const simpleGit = require("simple-git");

// Data Store Setup
const STORE_PATH = path.join(app.getPath("userData"), "store.json");

const loadStore = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch (err) {
    console.error("Error loading store:", err);
  }
  return {
    theme: "light",
    lastScannedFolder: null,
    aiResponses: {},
    settings: {},
  };
};

const saveStore = (data) => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving store:", err);
  }
};

let store = loadStore();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
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

ipcMain.handle("scan-repos", async (event, rootPath) => {
  const repos = [];
  const scan = async (dir) => {
    const files = fs.readdirSync(dir);
    if (files.includes(".git")) {
      const git = simpleGit(dir);
      const status = await git.status();
      const branch = await git.revparse(["--abbrev-ref", "HEAD"]);
      const log = await git.log({ maxCount: 1 });

      repos.push({
        name: path.basename(dir),
        path: dir,
        status: status.files.length > 0 ? "Uncommitted" : "Clean",
        branch: branch,
        lastCommit: log.latest?.message || "No commits",
        summary: "Repository found on disk.", // Placeholder for AI summary later
      });
      return; // Stop recursion if .git found
    }

    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (
        fs.statSync(fullPath).isDirectory() &&
        !file.startsWith(".") &&
        file !== "node_modules"
      ) {
        await scan(fullPath);
      }
    }
  };

  try {
    await scan(rootPath);
    return repos;
  } catch (error) {
    console.error("Scan error:", error);
    return [];
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
