const { registerUserHandlers } = require('./user.handler');
const { ipcMain } = require('electron');

function registerAllHandlers() {
    registerUserHandlers(ipcMain);
  }
  
  module.exports = {
    registerAllHandlers,
  };