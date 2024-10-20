const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getUsers: () => ipcRenderer.invoke('get-users'),
});
