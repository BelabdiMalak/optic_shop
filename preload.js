const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (message) => ipcRenderer.send('channel', message)
});
