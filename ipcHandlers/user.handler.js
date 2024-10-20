const userModel = require('../backend/models/user.model.js');

// Handler to get users
async function getUsers() {
  try {
    const users = await userModel.findMany();
    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Register the IPC handlers
function registerUserHandlers(ipcMain) {
  ipcMain.handle('get-users', getUsers);
}

module.exports = {
  registerUserHandlers,
};
