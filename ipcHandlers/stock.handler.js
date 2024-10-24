const stockService = require('../backend/services/stock.service');

async function getStocks(event, filter) {
    try {
        return await stockService.getStocks(filter);
    } catch (error) {
        console.error('Error fetching stocks (handler):', error);
        throw error;
    }
}

async function createStock(event, data) {
    try {
        return await stockService.createStock(data);
    } catch (error) {
        console.error('Error creating stock (handler):', error);
        throw error;
    }
}

async function getStock(event, id) {
    try {
        return await stockService.findStockById(id);
    } catch (error) {
        console.error('Error fetching stock (handler):', error);
        throw error;
    }
}

async function updateStock(event, id, data) {
    try {
        return await stockService.updateStock(id, data);
    } catch (error) {
        console.error('Error updating stock (handler):', error);
        throw error;
    }
}

// Register the IPC handlers
function registerStockHandlers(ipcMain) {
    ipcMain.handle('get-stock', getStock);
    ipcMain.handle('get-stocks', getStocks);
    ipcMain.handle('create-stock', createStock);
    ipcMain.handle('update-stock', updateStock);
}

module.exports = {
    registerStockHandlers,
};
