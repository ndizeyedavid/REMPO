// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  scanRepos: (rootPath) => ipcRenderer.invoke("scan-repos", rootPath),
  openInEditor: (repoPath) => ipcRenderer.invoke("open-in-editor", repoPath),
});
