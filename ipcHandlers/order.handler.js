const orderService = require('../backend/services/order.service');

async function getOrders(event, filter) {
    try {
        return await orderService.getOrders(filter);
    } catch (error) {
        console.error('Error fetching orders (handler):', error);
        throw error;
    }
}

async function createOrder(event, data) {
    try {
        return await orderService.createOrder(data);
    } catch (error) {
        console.error('Error creating order (handler):', error);
        throw error;
    }
}

async function getOrder(event, id) {
    try {
        return await orderService.findOrderById(id);
    } catch (error) {
        console.error('Error fetching order (handler):', error);
        throw error;
    }
}

async function updateOrder(event, id, data) {
    try {
        return await orderService.updateOrder(id, data);
    } catch (error) {
        console.error('Error updating order (handler):', error);
        throw error;
    }
}

// Register the IPC handlers
function registerOrderHandlers(ipcMain) {
    ipcMain.handle('get-order', getOrder);
    ipcMain.handle('get-orders', getOrders);
    ipcMain.handle('create-order', createOrder);
    ipcMain.handle('update-order', updateOrder);
}

module.exports = {
    registerOrderHandlers,
};
