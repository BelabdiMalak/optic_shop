const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.order.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating an order: ' + error.message);
    }
}

const findMany = async ({ page, limit, orderField, orderBy, userId, status, date }) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                ...(userId && { userId }),
                ...(status && { status }),
                ...(date && {
                    date: {
                        equals: new Date(date),
                    },
                }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
        const totalElements = await prisma.order.count({
            where: {
              ...(userId && { userId }),
              ...(status && { status }),
              ...(date && { date: { equals: new Date(date) } }),
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
            orders, 
            pagination
        }
    } catch (error) {
        throw new Error('Error in finding many products: ' + error.message);
    }
}

const _findMany = async () => {
    try {
        return await prisma.order.findMany({});
    } catch (error) {
        throw new Error('Error in finding many orders: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.order.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding an order: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.order.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating an order: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.order.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding orders by filter: ' + error.message);
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
