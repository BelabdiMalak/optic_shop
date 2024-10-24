const productValidator = require('../validators/product.validator');
const productModel = require('../models/product.model');

const createProduct = async (data) => {
    try {
        const { error } = productValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const createdProduct = await productModel.createOne(data);
        return {
            status: true,
            message: 'Product created successfully',
            data: createdProduct
        };
    } catch (error) {
        throw new Error(`Error in creating product (service): ${error}`);
    }
};

const updateProduct = async (id, data) => {
    try {
        const product = await productModel.findUnique(id);
        if (!product) {
            return {
                status: false,
                message: 'Product not found'
            };
        }

        const { error } = productValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const updatedProduct = await productModel.updateOne(id, data);
        return {
            status: true,
            message: 'Product updated successfully',
            data: updatedProduct
        };
    } catch (error) {
        throw new Error(`Error in updating product (service): ${error}`);
    }
};

const findProductById = async (id) => {
    try {
        const product = await productModel.findUnique(id); 
        if (!product) {
            return {
                status: false,
                message: 'Product not found'
            };
        }

        return {
            status: true,
            message: 'Product fetched successfully',
            data: product
        };
    } catch (error) {
        throw new Error(`Error in finding product by ID (service): ${error}`);
    }
};

const getProducts = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    name,
    category 
}) => {
    try {
        const products = await productModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            name,
            category
        });

        return {
            status: true,
            message: 'Products fetched successfully',
            data: products
        };
    } catch (error) {
        throw new Error(`Error in getting products (service): ${error}`);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    findProductById,
    getProducts
};
