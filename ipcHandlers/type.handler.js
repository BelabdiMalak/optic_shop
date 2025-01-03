const typeService = require('../backend/services/type.service');

async function getTypes(event, filter) {
  try {
    return await typeService.getTypes(filter);
  } catch (error) {
    console.error('Error fetching types (handler):', error);
    throw error;
  }
}

async function createType(event, data) {
  try {
    return await typeService.createType(data);
  } catch (error) {
    console.error('Error creating type (handler):', error);
    throw error;
  }
}

async function getType(event, where) {
  try {
    return await typeService.findTypeBy(where);
  } catch (error) {
    console.error('Error fetching type (handler):', error);
    throw error;
  }
}

async function updateType(event, id, data) {
  try {
    return await typeService.updateType(id, data);
  } catch (error) {
    console.error('Error updating type (handler):', error);
    throw error;
  }
}

// Register the IPC handlers
function registerTypeHandlers(ipcMain) {
  ipcMain.handle('get-type', getType);
  ipcMain.handle('get-types', getTypes);
  ipcMain.handle('create-type', createType);
  ipcMain.handle('update-type', updateType);
}

module.exports = {
  registerTypeHandlers,
};
