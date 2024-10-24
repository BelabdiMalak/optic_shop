const userService = require('../backend/services/user.service');

async function getUsers(event, filter) {
  try {
    return await userService.getUsers(filter);
  } catch (error) {
    console.error('Error fetching users (handler):', error);
    throw error;
  }
}

async function createUser(event, data) {
  try {
    return await userService.createUser(data);
  } catch (error) {
    console.error('Error creating user (handler):', error);
    throw error;
  }
}

async function getUser (event, id) {
  try {
    return await userService.findUserById(id);
  } catch (error) {
    console.error('Error fetching user (handler):', error);
    throw error
  }
}

async function updateUser(event, id, data) {
  try {
    return await userService.updateUser(id, data);
  } catch (error) {
    console.error('Error updating user (handler):', error);
    throw error
  }
}

// Register the IPC handlers
function registerUserHandlers(ipcMain) {
  ipcMain.handle('get-user', getUser);
  ipcMain.handle('get-users', getUsers);
  ipcMain.handle('create-user', createUser);
  ipcMain.handle('update-user', updateUser);
}

module.exports = {
  registerUserHandlers,
};
