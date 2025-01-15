const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {

  // User
  getUser: (id) => ipcRenderer.invoke('get-user', id),
  createUser: (data) => ipcRenderer.invoke('create-user', data),
  getUsers: (filter) => ipcRenderer.invoke('get-users', filter),
  updateUser: (id, data) => ipcRenderer.invoke('update-user', id, data),
  deleteUser: (id) => ipcRenderer.invoke('delete-user', id),

  // Type
  getType: (where) => ipcRenderer.invoke('get-type', where),
  createType: (data) => ipcRenderer.invoke('create-type', data),
  getTypes: (filter) => ipcRenderer.invoke('get-types', filter),
  updateType: (id, data) => ipcRenderer.invoke('update-type', id, data),

  // SubType
  getSubType: (where) => ipcRenderer.invoke('get-subtype', where),
  createSubType: (data) => ipcRenderer.invoke('create-subtype', data),
  getSubTypes: (filter) => ipcRenderer.invoke('get-subtypes', filter),
  updateSubType: (id, data) => ipcRenderer.invoke('update-subtype', id, data),

  // Product
  getProduct: (id) => ipcRenderer.invoke('get-product', id),
  createProduct: (data) => ipcRenderer.invoke('create-product', data),
  getProducts: (filter) => ipcRenderer.invoke('get-products', filter),
  updateProduct: (id, data) => ipcRenderer.invoke('update-product', id, data),
  getProductDetails: () => ipcRenderer.invoke('get-products-details'),

  // Stock
  getStock: (id) => ipcRenderer.invoke('get-stock', id),
  deleteStock: (id) => ipcRenderer.invoke('delete-stock', id),
  createStock: (data) => ipcRenderer.invoke('create-stock', data),
  getStocks: (filter) => ipcRenderer.invoke('get-stocks', filter),
  updateStock: (id, data) => ipcRenderer.invoke('update-stock', id, data),

  // Order
  getOrder: (id) => ipcRenderer.invoke('get-order', id),
  deleteOrder: (id) => ipcRenderer.invoke('delete-order', id),
  createOrder: (data) => ipcRenderer.invoke('create-order', data),
  getOrders: (filter) => ipcRenderer.invoke('get-orders', filter),
  updateOrder: (id, data) => ipcRenderer.invoke('update-order', id, data),
  getTurnOver: () => ipcRenderer.invoke('turnover-order'),
  getProductsSold: () => ipcRenderer.invoke('productsSold-order'),

  // Order Item
  getOrderItem: (id) => ipcRenderer.invoke('get-orderItem', id),
  createOrderItem: (data) => ipcRenderer.invoke('create-orderItem', data),
  getOrderItems: (filter) => ipcRenderer.invoke('get-orderItems', filter),
  updateOrderItem: (id, data) => ipcRenderer.invoke('update-orderItem', id, data),
});
