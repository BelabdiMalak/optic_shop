const { registerUserHandlers } = require('./user.handler');
const { registerTypeHandlers } = require('./type.handler');
const { registerOrderHandlers } = require('./order.handler');
const { registerStockHandlers } = require('./stock.handler');
const { registerSubTypeHandlers } = require('./subType.handler');
const { registerProductHandlers } = require('./product.handler');

const { ipcMain } = require('electron');

function registerAllHandlers() {
    registerUserHandlers(ipcMain);
    registerTypeHandlers(ipcMain);
    registerStockHandlers(ipcMain);
    registerOrderHandlers(ipcMain);
    registerSubTypeHandlers(ipcMain);
    registerProductHandlers(ipcMain);
  }
  
  module.exports = {
    registerAllHandlers,
  };