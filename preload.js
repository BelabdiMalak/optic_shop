const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getUsers: () => ipcRenderer.invoke('get-users'),
  createUser: (data) => ipcRenderer.invoke('create-user', data)
});
