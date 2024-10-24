const subTypeValidator = require('../validators/subType.validator');
const subTypeModel = require('../models/subType.model');

const createSubType = async (data) => {
    try {
        const { error } = subTypeValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const createdSubType = await subTypeModel.createOne(data);
        return {
            status: true,
            message: 'SubType created successfully',
            data: createdSubType
        };
    } catch (error) {
        throw new Error(`Error in creating subtype (service): ${error}`);
    }
};

const updateSubType = async (id, data) => {
    try {
        const subType = await subTypeModel.findUnique(id);
        if (!subType) {
            return {
                status: false,
                message: 'SubType not found'
            };
        }

        const { error } = subTypeValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const updatedSubType = await subTypeModel.updateOne(id, data);
        return {
            status: true,
            message: 'SubType updated successfully',
            data: updatedSubType
        };
    } catch (error) {
        throw new Error(`Error in updating subtype (service): ${error}`);
    }
};

const findSubTypeById = async (id) => {
    try {
        const subType = await subTypeModel.findUnique(id);
        if (!subType) {
            return {
                status: false,
                message: 'SubType not found'
            };
        }

        return {
            status: true,
            message: 'SubType fetched successfully',
            data: subType
        };
    } catch (error) {
        throw new Error(`Error in finding subtype by ID (service): ${error}`);
    }
};

const getSubTypes = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    name 
}) => {
    try {
        const { subTypes, pagination } = await subTypeModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            name
        });

        return {
            status: true,
            message: 'SubTypes fetched successfully',
            data: subTypes,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting subtypes (service): ${error}`);
    }
};

module.exports = {
    createSubType,
    updateSubType,
    findSubTypeById,
    getSubTypes
};
