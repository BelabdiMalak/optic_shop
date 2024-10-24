const prisma = require('../../config/prisma.config.js');

const createOne = async (data) => {
    try {
        return await prisma.type.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a type: ' + error.message);
    }
}

const findMany = async ({ page, limit, orderField, orderBy, name }) => {
    try {
        const types = await prisma.type.findMany({
            where: {
                ...(name && {
                    name: {
                      contains: name,
                    },
                  }),
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
        const totalElements = await prisma.type.count({
            where: {
                ...(name && {
                    name: { contains: name },
                  }),
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
            types,
            pagination
        }
    } catch (error) {
        throw new Error('Error in finding many types: ' + error.message);
    }
}

const _findMany = async () => {
    try {
        return await prisma.type.findMany({});
    } catch (error) {
        throw new Error('Error in finding many types: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        return await prisma.type.findUnique({
            where: { id }
        });
    } catch (error) {
        throw new Error('Error in finding a type: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.type.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating a type: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.type.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding types by filter: ' + error.message);
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
