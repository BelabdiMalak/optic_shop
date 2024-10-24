const subTypeService = require('../backend/services/subType.service');

async function getSubTypes(event, filter) {
    try {
        return await subTypeService.getSubTypes(filter);
    } catch (error) {
        console.error('Error fetching subtypes (handler):', error);
        throw error;
    }
}

async function createSubType(event, data) {
    try {
        return await subTypeService.createSubType(data);
    } catch (error) {
        console.error('Error creating subtype (handler):', error);
        throw error;
    }
}

async function getSubType(event, id) {
    try {
        return await subTypeService.findSubTypeById(id);
    } catch (error) {
        console.error('Error fetching subtype (handler):', error);
        throw error;
    }
}

async function updateSubType(event, id, data) {
    try {
        return await subTypeService.updateSubType(id, data);
    } catch (error) {
        console.error('Error updating subtype (handler):', error);
        throw error;
    }
}

// Register the IPC handlers
function registerSubTypeHandlers(ipcMain) {
    ipcMain.handle('get-subtype', getSubType);
    ipcMain.handle('get-subtypes', getSubTypes);
    ipcMain.handle('create-subtype', createSubType);
    ipcMain.handle('update-subtype', updateSubType);
}

module.exports = {
    registerSubTypeHandlers,
};
