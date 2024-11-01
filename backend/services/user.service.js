const userValidator = require('../validators/user.validator');
const userModel = require('../models/user.model');

const createUser = async (data) => {
    try {
        const { error } = userValidator.createSchema.validate(data);
        if (error)
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            }

        return {
            status: true,
            message: 'User created successfully',
            data: await userModel.createOne(data)
        }
    } catch (error) {
        throw new Error(`'Error in creating user (service), ${error}'`);
    }
}

const updateUser = async (id, data) => {
    try {
        const user = await userModel.findUnique(id);
        if (!user)
            return {
                status: false,
                message: 'User not found'
            }

        const { error } = userValidator.updateSchema.validate(data);
        if (error)
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            }

        return {
            status: true,
            message: 'User updated successfully',
            data: await userModel.updateOne(id, data)
        }
    } catch (error) {
        throw new Error(`Error in updating user (service): ${error}`);
    }
}

const findUserById = async (id) => {
    try {
        const user = await userModel.findUnique(id);
        if (!user)
            return {
                status: false,
                message: 'User not found'
            }

        return {
            status: true,
            message: 'User fetched successfully',
            data: user
        }
    } catch (error) {
        throw new Error(`Error in finding user by id service ${error}`);
    }
}

const getUsers = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    name,
    surename
}) => {
    try {
        const { users, pagination } = await userModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            name,
            surename
        })
        return {
            status: true,
            message: 'Users fetched successfully',
            data: users,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting users (service): ${error}`);
    }
}

module.exports = {
    createUser,
    updateUser,
    findUserById,
    getUsers
}