const { PRODUCT_SUB_TYPES } = require('../const/subType.const');
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().valid(...PRODUCT_SUB_TYPES).required()
        .messages({
            'string.base': 'Name must be a string',
            'any.only': 'Invalid name',
            'any.required': 'Name is required'
        }),
    typeId: Joi.string().uuid().required()
            .messages({
                'string.base': 'Name must be a string',
                'any.required': 'Name is required'
            })
});

module.exports = { 
    createSchema
};
