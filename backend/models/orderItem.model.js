const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.orderItem.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating an order item: ' + error.message);
    }
}

const findMany = async ({ page, limit, orderField, orderBy, orderId, productId }) => {
    try {
        const orderItems = await prisma.orderItem.findMany({
            where: {
                ...(orderId && { orderId }),
                ...(productId && { productId }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
        const totalElements = await prisma.orderItem.count({
            where: {
                ...(orderId && { orderId }),
                ...(productId && { productId }),
            },
        });
        const pagination = {
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalElements / limit),
            totalElements: totalElements,
            hasNext: page * limit < totalElements,
        };
        return {
            orderItems,
            pagination
        };
    } catch (error) {
        throw new Error('Error in finding many order items: ' + error.message);
    }
}

const _findMany = async () => {
    try {
        return await prisma.orderItem.findMany({});
    } catch (error) {
        throw new Error('Error in finding many order items: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.orderItem.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding an order item: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.orderItem.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating an order item: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.orderItem.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding order items by filter: ' + error.message);
    }
}

module.exports = {
    createOne,
    findMany,
    findUnique,
    updateOne,
    findBy,
    _findMany
};
