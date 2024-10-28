const stockValidator = require('../validators/stock.validator');
const productModel = require('../models/product.model');
const { STOCK_TYPE } = require('../const/stock.const');
const stockModel = require('../models/stock.model');

const createStock = async (data) => {
    try {
        const { error } = stockValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const product = await productModel.findUnique(data.productId);
        if (!product)
            return {
                status: false,
                message: 'Invalid product ID'
            }
        
        if (data.type === STOCK_TYPE.OUT && data.quantity > product.stockQuantity)
            return {
                status: false,
                message: `Insufficient stock quantity`,
                data: {
                    quantity: product.stockQuantity
                }
            }

        data.type === STOCK_TYPE.IN && await productModel.updateOne(
            product.id,
            { stockQuantity: (product.stockQuantity + data.quantity)}
        )

        data.type === STOCK_TYPE.OUT && await productModel.updateOne(
            product.id,
            { stockQuantity: (product.stockQuantity - data.quantity)}
        )

        const createdStock = await stockModel.createOne(data);
        return {
            status: true,
            message: 'Stock created successfully',
            data: createdStock
        };
    } catch (error) {
        throw new Error(`Error in creating stock (service): ${error}`);
    }
};

const updateStock = async (id, data) => {
    try {
        const stock = await stockModel.findUnique(id);
        if (!stock) {
            return {
                status: false,
                message: 'Stock not found'
            };
        }

        const { error } = stockValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const product = data.productId && productModel.findUnique(data.productId);
        if (data.productId && !product)
            return {
                status: false,
                message: 'Invalid product ID'
            }

        const updatedStock = await stockModel.updateOne(id, data);
        return {
            status: true,
            message: 'Stock updated successfully',
            data: updatedStock
        };
    } catch (error) {
        throw new Error(`Error in updating stock (service): ${error}`);
    }
};

const findStockById = async (id) => {
    try {
        const stock = await stockModel.findUnique(id);
        if (!stock) {
            return {
                status: false,
                message: 'Stock not found'
            };
        }

        return {
            status: true,
            message: 'Stock fetched successfully',
            data: stock
        };
    } catch (error) {
        throw new Error(`Error in finding stock by ID (service): ${error}`);
    }
};

const getStocks = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    productId,
    status
}) => {
    try {
        const { stocks, pagination } = await stockModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            productId,
            status
        });

        return {
            status: true,
            message: 'Stocks fetched successfully',
            data: stocks,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting stocks (service): ${error}`);
    }
};

module.exports = {
    createStock,
    updateStock,
    findStockById,
    getStocks
};
