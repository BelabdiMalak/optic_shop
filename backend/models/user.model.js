const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.user.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a user: ' + error.message);
    }
}

const findMany = async ({ page = 1, limit = 10, orderBy = 'desc', orderField = 'createdAt', name, surename }) => {
    try {
        return await prisma.user.findMany({
            where: {
                ...(name && {
                    name: {
                      contains: name,
                    },
                  }),
                  ...(surename && {
                    surename: {
                      contains: surename,
                    },
                  }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
    } catch (error) {
        throw new Error('Error in finding many users: ' + error.message);
    }
}

const _findMany = async() => {
    try {
        return await prisma.user.findMany({})
    } catch (error) {
        throw new Error('Error in finding many users: ' + error.message); 
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.user.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding a user: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.user.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating a user: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.user.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding users by filter: ' + error.message);
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
