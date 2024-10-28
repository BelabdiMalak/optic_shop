const orderItemService = require('../backend/services/orderItem.service');

async function getOrderItems(event, filter) {
    try {
        return await orderItemService.getOrderItems(filter);
    } catch (error) {
        console.error('Error fetching order items (handler):', error);
        throw error;
    }
}

async function createOrderItem(event, data) {
    try {
        return await orderItemService.createOrderItem(data);
    } catch (error) {
        console.error('Error creating order item (handler):', error);
        throw error;
    }
}

async function getOrderItem(event, id) {
    try {
        return await orderItemService.findOrderItemById(id);
    } catch (error) {
        console.error('Error fetching order item (handler):', error);
        throw error;
    }
}

async function updateOrderItem(event, id, data) {
    try {
        return await orderItemService.updateOrderItem(id, data);
    } catch (error) {
        console.error('Error updating order item (handler):', error);
        throw error;
    }
}

// Register the IPC handlers
function registerOrderItemHandlers(ipcMain) {
    ipcMain.handle('get-order-item', getOrderItem);
    ipcMain.handle('get-order-items', getOrderItems);
    ipcMain.handle('create-order-item', createOrderItem);
    ipcMain.handle('update-order-item', updateOrderItem);
}

module.exports = {
    registerOrderItemHandlers,
};
