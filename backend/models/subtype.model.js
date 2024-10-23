const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.subType.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a subType: ' + error.message);
    }
}

const findMany = async () => {
    try {
        return await prisma.subType.findMany({});
    } catch (error) {
        throw new Error('Error in finding many subTypes: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.subType.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding a subType: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.subType.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating a subType: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.subType.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding subTypes by filter: ' + error.message);
    }
}

module.exports = {
    createOne,
    findMany,
    findUnique,
    updateOne,
    findBy
}
