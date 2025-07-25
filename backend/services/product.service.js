const productValidator = require('../validators/product.validator');
const productModel = require('../models/product.model');
const subTypeModel = require('../models/subType.model');
const typeModel = require('../models/type.model');
const prisma = require('../../config/prisma.config');

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
    page, 
    limit, 
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

const getProductDetails = async () => {
    try {
        return {
            status: true,
            message: 'success',
             data: await prisma.productDetail.findMany({
                select: {
                    id: true,
                    category: true,
                    sphereL: true,
                    cylinderL: true,
                    sphereR: true,
                    cylinderR: true,
                    productId: true,
                    quantity: true,
                    product: {
                        select: {
                            subType: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
             })
        }
    } catch (error) {
        throw new Error(`Error in finding products details (service): ${error}`);
    }
}

const updateProductDetails = async (id, data) => {
    try {
        const { error } = productValidator.updateProductDetailsSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        return {
            status: true,
            message: 'success',
            data: await prisma.productDetail.update({
                where: { id: id },
                data: data
            })
        }
    } catch (error) {
        throw new Error(`Error in updating products details (service): ${error}`);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    findProductById,
    getProducts,
    getProductDetails,
    updateProductDetails
};
