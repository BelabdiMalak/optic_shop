const registerUserHandlers = require('./user.handler').registerUserHandlers;
const registerTypeHandlers = require('./type.handler').registerTypeHandlers;
const registerOrderHandlers = require('./order.handler').registerOrderHandlers;
const registerStockHandlers = require('./stock.handler').registerStockHandlers;
const registerSubTypeHandlers = require('./subType.handler').registerSubTypeHandlers;
const registerProductHandlers = require('./product.handler').registerProductHandlers;
const registerOrderItemHandlers = require('./orderItem.handler').registerOrderItemHandlers;

const ipcMain = require('electron').ipcMain;

function registerAllHandlers() {
    registerUserHandlers(ipcMain);
    registerTypeHandlers(ipcMain);
    registerStockHandlers(ipcMain);
    registerOrderHandlers(ipcMain);
    registerSubTypeHandlers(ipcMain);
    registerProductHandlers(ipcMain);
    registerOrderItemHandlers(ipcMain);
}

module.exports = {
    registerAllHandlers,
};
