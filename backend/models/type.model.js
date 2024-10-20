const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.type.create({
            data
        })
    } catch (error) {
        throw new Error('Error in creating a type: ', error);
    }
}

const findMany = async () => {
    try {
        return await prisma.type.findMany({});
    } catch (error) {
        throw new Error('Error in finding many types: ', error);
    }
}

module.exports = {
    createOne,
    findMany
}