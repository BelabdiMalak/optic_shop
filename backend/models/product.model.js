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
        return await prisma.product.findMany({
            where: {
                ...(typeId && { typeId }),
                ...(subTypeId && { subTypeId }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
    } catch (error) {
        throw new Error('Error in finding many products: ' + error.message);
    }
}

const _findMany = async () => {
    try {
        return await prisma.product.findMany({});
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
