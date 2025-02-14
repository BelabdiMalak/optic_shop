const productService = require('../backend/services/product.service');

async function getProducts(event, filter) {
    try {
        return await productService.getProducts(filter);
    } catch (error) {
        console.error('Error fetching products (handler):', error);
        throw error;
    }
}

async function createProduct(event, data) {
    try {
        return await productService.createProduct(data);
    } catch (error) {
        console.error('Error creating product (handler):', error);
        throw error;
    }
}

async function getProduct(event, id) {
    try {
        return await productService.findProductById(id);
    } catch (error) {
        console.error('Error fetching product (handler):', error);
        throw error;
    }
}

async function updateProduct(event, id, data) {
    try {
        return await productService.updateProduct(id, data);
    } catch (error) {
        console.error('Error updating product (handler):', error);
        throw error;
    }
}

async function getProductDetails(event) {
    try {
        return await productService.getProductDetails();
    } catch (error) {
        console.error('Error fetching products details (handler):', error);
        throw error;
    }
}

async function updateProductDetails(event, id, data) {
    try {
        return await productService.updateProductDetails(id, data);
    } catch (error) {
        console.error('Error updating product details (handler):', error);
        throw error;
    }
}

// Register the IPC handlers
function registerProductHandlers(ipcMain) {
    ipcMain.handle('get-product', getProduct);
    ipcMain.handle('get-products', getProducts);
    ipcMain.handle('create-product', createProduct);
    ipcMain.handle('update-product', updateProduct);
    ipcMain.handle('get-products-details', getProductDetails);
    ipcMain.handle('update-product-details', updateProductDetails);
}

module.exports = {
    registerProductHandlers,
};
