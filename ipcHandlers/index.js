const { registerUserHandlers } = require('./user.handler');
const { registerTypeHandlers } = require('./type.handler');
const { registerSubTypeHandlers } = require('./subType.handler');
const { registerProductHandlers } = require('./product.handler');

const { ipcMain } = require('electron');

function registerAllHandlers() {
    registerUserHandlers(ipcMain);
    registerTypeHandlers(ipcMain);
    registerSubTypeHandlers(ipcMain);
    registerProductHandlers(ipcMain);
  }
  
  module.exports = {
    registerAllHandlers,
  };