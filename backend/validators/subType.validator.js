const { PRODUCT_SUBTYPES } = require('../const/subType.const');
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().valid(...Object.values(PRODUCT_SUBTYPES)).required()
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
