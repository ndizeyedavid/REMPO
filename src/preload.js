// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  scanRepos: (rootPath, options) =>
    ipcRenderer.invoke("scan-repos", rootPath, options),
  openInEditor: (repoPath) => ipcRenderer.invoke("open-in-editor", repoPath),
  getStore: (key) => ipcRenderer.invoke("get-store", key),
  updateStore: (key, value) => ipcRenderer.invoke("update-store", key, value),
  getHomeDir: () => ipcRenderer.invoke("get-home-dir"),
  getQuickAccessPaths: () => ipcRenderer.invoke("get-quick-access-paths"),
  listDrives: () => ipcRenderer.invoke("list-drives"),
  listDir: (data) => ipcRenderer.invoke("list-dir", data),
  getRepoDetails: (repoPath) =>
    ipcRenderer.invoke("get-repo-details", repoPath),
  commitAndPush: (data) => ipcRenderer.invoke("commit-and-push", data),
  getRemoteUrl: (repoPath) => ipcRenderer.invoke("get-remote-url", repoPath),
  openInBrowser: (url) => ipcRenderer.invoke("open-in-browser", url),
  sendNotification: (data) => ipcRenderer.invoke("send-notification", data),
  runGitCommand: (data) => ipcRenderer.invoke("run-git-command", data),
  windowMinimize: () => ipcRenderer.invoke("window-minimize"),
  windowToggleMaximize: () => ipcRenderer.invoke("window-toggle-maximize"),
  windowClose: () => ipcRenderer.invoke("window-close"),
  windowIsMaximized: () => ipcRenderer.invoke("window-is-maximized"),

  generateSummary: (data) => ipcRenderer.invoke("generate-summary", data),

  onScanProgress: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on("scan-progress", handler);
    return () => ipcRenderer.removeListener("scan-progress", handler);
  },
});
