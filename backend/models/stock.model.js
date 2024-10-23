const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.stock.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a stock: ' + error.message);
    }
}

const findMany = async () => {
    try {
        return await prisma.stock.findMany({});
    } catch (error) {
        throw new Error('Error in finding many stocks: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.stock.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding a stock: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.stock.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating a stock: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.stock.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding stocks by filter: ' + error.message);
    }
}

module.exports = {
    createOne,
    findMany,
    findUnique,
    updateOne,
    findBy
}
