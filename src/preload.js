// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  scanRepos: (rootPath) => ipcRenderer.invoke("scan-repos", rootPath),
  openInEditor: (repoPath) => ipcRenderer.invoke("open-in-editor", repoPath),
  getStore: (key) => ipcRenderer.invoke("get-store", key),
  updateStore: (key, value) => ipcRenderer.invoke("update-store", key, value),
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

  ptyCreate: (data) => ipcRenderer.invoke("pty-create", data),
  ptyWrite: (data) => ipcRenderer.invoke("pty-write", data),
  ptyResize: (data) => ipcRenderer.invoke("pty-resize", data),
  ptyDispose: (data) => ipcRenderer.invoke("pty-dispose", data),

  onPtyData: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on("pty-data", handler);
    return () => ipcRenderer.removeListener("pty-data", handler);
  },
  onPtyExit: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on("pty-exit", handler);
    return () => ipcRenderer.removeListener("pty-exit", handler);
  },
});
