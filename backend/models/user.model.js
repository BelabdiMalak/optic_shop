const prisma = require('../../config/prisma.config');

const createOne = async (data) => {
    try {
        return await prisma.user.create({
            data
        });
    } catch (error) {
        throw new Error('Error in creating a user: ', error);
    }
}

module.exports = {
    createOne
}