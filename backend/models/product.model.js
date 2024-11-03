const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.product.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a product: ' + error.message);
    }
}

const findMany = async ({ page, limit, orderField, orderBy, typeId, subTypeId }) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(typeId && { typeId }),
                ...(subTypeId && { subTypeId }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
        const totalElements = await prisma.product.count({
            where: {
                ...(typeId && { typeId }),
                ...(subTypeId && { subTypeId }),
            },
          })
        const pagination = {
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalElements / limit),
            totalElements: totalElements,
            hasNext: page * limit < totalElements,
        }
        return {
            products,
            pagination
        }
    } catch (error) {
        throw new Error('Error in finding many products: ' + error.message);
    }
}

const _findMany = async ({where}) => {
    try {
        return await prisma.product.findMany({
            where
        });
    } catch (error) {
        throw new Error('Error in finding many products: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.product.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding a product: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.product.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating a product: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.product.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding products by filter: ' + error.message);
    }
}

module.exports = {
    createOne,
    findMany,
    findUnique,
    updateOne,
    findBy,
    _findMany
}
