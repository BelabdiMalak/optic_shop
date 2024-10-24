const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getUser: (id) => ipcRenderer.invoke('get-user', id),
  createUser: (data) => ipcRenderer.invoke('create-user', data),
  getUsers: (filter) => ipcRenderer.invoke('get-users', filter),
  updateUser: (id, data) => ipcRenderer.invoke('update-user', id, data)
});
