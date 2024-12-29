const { join } = require('path');
const preloadPath = join(__dirname, 'preload.js');
const { app, BrowserWindow } = require('electron');
const handlersPath = join(__dirname, 'ipcHandlers/index.js')
const { registerAllHandlers } = require(handlersPath);

try {
  let mainWindow;

  async function createWindow() {
    const { default: isDev } = await import('electron-is-dev');

    mainWindow = new BrowserWindow({
      width: 1080,
      height: 920,
      autoHideMenuBar: true,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: true,
        contextIsolation: true,
        webSecurity: true,
      },
    });

    let startURL;
    if (isDev) {
      startURL = 'http://localhost:5173';
      mainWindow.webContents.openDevTools();
    } else {
      startURL = `file://${join(__dirname, 'dist', 'index.html')}`;
    }
    
    mainWindow.loadURL(startURL);
    
    registerAllHandlers();

    mainWindow.on('closed', () => (mainWindow = null));
  }

  app.on('ready', createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
} catch (error) {
  console.error(`Error in running electron app: ${error}`);
  app.quit();
}
