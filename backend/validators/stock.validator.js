const { STOCK_TYPE } = require('../const/stock.const');
const Joi = require('joi');

const createSchema = Joi.object({
    type: Joi.string().valid(...Object.values(STOCK_TYPE)).required()
        .messages({
            'string.base': 'Type must be a string',
            'any.only': 'Type must be one of the following: in, out',
            'any.required': 'Type is required'
        }),
    quantity: Joi.number().integer().min(0).required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity cannot be negative',
            'any.required': 'Quantity is required'
        }),
    productId: Joi.string().uuid().required()
        .messages({
            'string.base': 'Product ID must be a string',
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    date: Joi.date()
            .default(() => new Date())
            .messages({
                'date.base': 'Date must be a valid date',
                'any.default': 'Date defaults to now if not provided'
            }),
});

const updateSchema = Joi.object({
    type: Joi.string().valid(...Object.values(STOCK_TYPE))
        .messages({
            'string.base': 'Type must be a string',
            'any.only': 'Type must be one of the following: in, out',
        }),
    quantity: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity cannot be negative',
        }),
    productId: Joi.string().uuid()
        .messages({
            'string.base': 'Product ID must be a string',
            'string.guid': 'Product ID must be a valid UUID',
        }),
})

module.exports = {
    createSchema,
    updateSchema
};
