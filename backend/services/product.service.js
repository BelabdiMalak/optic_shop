const productValidator = require('../validators/product.validator');
const productModel = require('../models/product.model');
const subTypeModel = require('../models/subType.model');
const typeModel = require('../models/type.model');

const createProduct = async (data) => {
    try {
        const { error } = productValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        const type = await typeModel.findUnique(data.typeId);
        if (!type)
            return {
                status: false,
                message: 'Invalid type ID',
                type
            }

        const subType = await subTypeModel.findUnique(data.subTypeId);
        if (!subType || subType.typeId !== data.typeId)
            return {
                status: false,
                message: 'Invalid subtype ID',
                subTypeTypeId:subType.typeId ,
                dataTyeId: data.typeId

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
                data: error.details.map((err) => err.message)
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
    typeId,
    subTypeId
}) => {
    try {
        const { products, pagination } = await productModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            typeId,
            subTypeId
        });

        return {
            status: true,
            message: 'Products fetched successfully',
            data: products,
            pagination: pagination
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
