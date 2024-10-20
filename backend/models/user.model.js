const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.user.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a user: ', error);
    }
}

const findMany = async () => {
    try {
        return await prisma.user.findMany({});
    } catch (error) {
        throw new Error('Error in finding many users: ', error);
    }
}

module.exports = {
    createOne,
    findMany
}