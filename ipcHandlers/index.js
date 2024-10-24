const { registerUserHandlers } = require('./user.handler');
const { registerTypeHandlers } = require('./type.handler');
const { registerSubTypeHandlers } = require('./subType.handler');

const { ipcMain } = require('electron');

function registerAllHandlers() {
    registerUserHandlers(ipcMain);
    registerTypeHandlers(ipcMain);
    registerSubTypeHandlers(ipcMain);
  }
  
  module.exports = {
    registerAllHandlers,
  };