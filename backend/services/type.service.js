const typeValidator = require('../validators/type.validator');
const typeModel = require('../models/type.model');

const createType = async (data) => {
    try {
        const { error } = typeValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        const createdType = await typeModel.createOne(data);
        return {
            status: true,
            message: 'Type created successfully',
            data: createdType
        };
    } catch (error) {
        throw new Error(`Error in creating type (service): ${error}`);
    }
};

const updateType = async (id, data) => {
    try {
        const type = await typeModel.findUnique(id);
        if (!type) {
            return {
                status: false,
                message: 'Type not found'
            };
        }

        // const { error } = typeValidator.updateSchema.validate(data);
        // if (error) {
        //     return {
        //         status: false,
        //         message: 'Validation error',
        //         data: error.details.map((err) => err.message)
        //     };
        // }

        const updatedType = await typeModel.updateOne(id, data);
        return {
            status: true,
            message: 'Type updated successfully',
            data: updatedType
        };
    } catch (error) {
        throw new Error(`Error in updating type (service): ${error}`);
    }
};

const findTypeById = async (id) => {
    try {
        const type = await typeModel.findUnique(id);
        if (!type) {
            return {
                status: false,
                message: 'Type not found'
            };
        }

        return {
            status: true,
            message: 'Type fetched successfully',
            data: type
        };
    } catch (error) {
        throw new Error(`Error in finding type by ID (service): ${error}`);
    }
};

const getTypes = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    name 
}) => {
    try {
        const { types, pagination } = await typeModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            name
        });

        return {
            status: true,
            message: 'Types fetched successfully',
            data: types,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting types (service): ${error}`);
    }
};

module.exports = {
    createType,
    updateType,
    findTypeById,
    getTypes
};
