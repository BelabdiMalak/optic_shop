const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electron', {
    // User
    getUser: function (id) {
      return ipcRenderer.invoke('get-user', id);
    },
    createUser: function (data) {
      return ipcRenderer.invoke('create-user', data);
    },
    getUsers: function (filter) {
      return ipcRenderer.invoke('get-users', filter);
    },
    updateUser: function (id, data) {
      return ipcRenderer.invoke('update-user', id, data);
    },
    deleteUser: function (id) {
      return ipcRenderer.invoke('delete-user', id);
    },
  
    // Type
    getType: function (where) {
      return ipcRenderer.invoke('get-type', where);
    },
    createType: function (data) {
      return ipcRenderer.invoke('create-type', data);
    },
    getTypes: function (filter) {
      return ipcRenderer.invoke('get-types', filter);
    },
    updateType: function (id, data) {
      return ipcRenderer.invoke('update-type', id, data);
    },
  
    // SubType
    getSubType: function (where) {
      return ipcRenderer.invoke('get-subtype', where);
    },
    createSubType: function (data) {
      return ipcRenderer.invoke('create-subtype', data);
    },
    getSubTypes: function (filter) {
      return ipcRenderer.invoke('get-subtypes', filter);
    },
    updateSubType: function (id, data) {
      return ipcRenderer.invoke('update-subtype', id, data);
    },
  
    // Product
    getProduct: function (id) {
      return ipcRenderer.invoke('get-product', id);
    },
    createProduct: function (data) {
      return ipcRenderer.invoke('create-product', data);
    },
    getProducts: function (filter) {
      return ipcRenderer.invoke('get-products', filter);
    },
    updateProduct: function (id, data) {
      return ipcRenderer.invoke('update-product', id, data);
    },
    getProductDetails: function () {
      return ipcRenderer.invoke('get-products-details');
    },
    updateProductDetails: function (id, data) {
      return ipcRenderer.invoke('update-product-details', id, data);
    },

    // Stock
    getStock: function (id) {
      return ipcRenderer.invoke('get-stock', id);
    },
    deleteStock: function (id) {
      return ipcRenderer.invoke('delete-stock', id);
    },
    createStock: function (data) {
      return ipcRenderer.invoke('create-stock', data);
    },
    getStocks: function (filter) {
      return ipcRenderer.invoke('get-stocks', filter);
    },
    updateStock: function (id, data) {
      return ipcRenderer.invoke('update-stock', id, data);
    },
  
    // Order
    getOrder: function (id) {
      return ipcRenderer.invoke('get-order', id);
    },
    deleteOrder: function (id) {
      return ipcRenderer.invoke('delete-order', id);
    },
    createOrder: function (data) {
      return ipcRenderer.invoke('create-order', data);
    },
    getOrders: function (filter) {
      return ipcRenderer.invoke('get-orders', filter);
    },
    updateOrder: function (id, data) {
      return ipcRenderer.invoke('update-order', id, data);
    },
    getTurnOver: function () {
      return ipcRenderer.invoke('turnover-order');
    },
    getProductsSold: function () {
      return ipcRenderer.invoke('productsSold-order');
    },
  
    // Order Item
    getOrderItem: function (id) {
      return ipcRenderer.invoke('get-orderItem', id);
    },
    createOrderItem: function (data) {
      return ipcRenderer.invoke('create-orderItem', data);
    },
    getOrderItems: function (filter) {
      return ipcRenderer.invoke('get-orderItems', filter);
    },
    updateOrderItem: function (id, data) {
      return ipcRenderer.invoke('update-orderItem', id, data);
    },
  });
})
