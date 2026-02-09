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
});
