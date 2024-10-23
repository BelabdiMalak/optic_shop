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

const findMany = async () => {
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
    findBy
}
