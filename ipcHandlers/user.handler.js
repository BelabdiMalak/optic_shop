const userService = require('../backend/services/user.service');

async function getUsers() {
  try {
    return await userService.getUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
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


// Register the IPC handlers
function registerUserHandlers(ipcMain) {
  ipcMain.handle('get-users', getUsers);
  ipcMain.handle('create-user', createUser);
}

module.exports = {
  registerUserHandlers,
};
