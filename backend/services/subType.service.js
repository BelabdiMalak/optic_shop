const subTypeValidator = require('../validators/subType.validator');
const subTypeModel = require('../models/subType.model');
const typeModel = require('../models/type.model');
const {
    LENS_SUB_TYPE,
    GLASS_SUB_TYPE,
    SUNGLASS_SUB_TYPE,
    LENS_CLEANER_SUB_TYPE,
    GLASS_CLEANER_SUB_TYPE
} = require('../const/subType.const');

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

        const type = await typeModel.findUnique(data.typeId);
        if (!type) {
            return {
                status: false,
                message: 'Invalid type ID'
            };
        }

        // Validate subtype based on the group
        let validSubType = false;
        switch (type.name) { // 'Glass', 'Sunglass', 'Lens', 'LensCleaner', 'GlassCleaner'
            case 'Glass':
                validSubType = GLASS_SUB_TYPE.includes(data.name);
                break;
            case 'Sunglass':
                validSubType = SUNGLASS_SUB_TYPE.includes(data.name);
                break;
            case 'Lens':
                validSubType = LENS_SUB_TYPE.includes(data.name);
                break;
            case 'LensCleaner':
                validSubType = LENS_CLEANER_SUB_TYPE.includes(data.name);
                break;
            case 'GlassCleaner': // TODO : does not have subtype
                validSubType = GLASS_CLEANER_SUB_TYPE.includes(data.name);
                break;
            default:
                return {
                    status: false,
                    message: 'Invalid type for the provided subtype'
                };
        }

        if (!validSubType) {
            return {
                status: false,
                message: `Invalid subtype '${data.name}' for type '${type.name}'`
            };
        }

        // Create the subType
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
