const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {

  // User handlers
  getUser: (id) => ipcRenderer.invoke('get-user', id),
  createUser: (data) => ipcRenderer.invoke('create-user', data),
  getUsers: (filter) => ipcRenderer.invoke('get-users', filter),
  updateUser: (id, data) => ipcRenderer.invoke('update-user', id, data),

  // type handlers
  getType: (id) => ipcRenderer.invoke('get-type', id),
  createType: (data) => ipcRenderer.invoke('create-type', data),
  getTypes: (filter) => ipcRenderer.invoke('get-types', filter),
  updateType: (id, data) => ipcRenderer.invoke('update-type', id, data),

  // sub type handlers
  getSubType: (id) => ipcRenderer.invoke('get-subtype', id),
  createSubType: (data) => ipcRenderer.invoke('create-subtype', data),
  getSubTypes: (filter) => ipcRenderer.invoke('get-subtypes', filter),
  updateSubType: (id, data) => ipcRenderer.invoke('update-subtype', id, data)
});
