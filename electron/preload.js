import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  myApi: () => console.log('Hello from Electron Preload'),
});
