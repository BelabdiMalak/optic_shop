const { PRODUCT_TYPE } = require('../const/type.const');
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().valid(...PRODUCT_TYPE).required()
        .messages({
            'string.base': 'Name must be a string',
            'any.only': 'Name must be one of the following: glass, sunglass, lenses, cleaner',
            'any.required': 'Name is required'
        }),
});

module.exports = { 
    createSchema
};
