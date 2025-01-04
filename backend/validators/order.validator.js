const { ORDER_STATUS } = require('../const/order.const');
const Joi = require('joi');

const createSchema = Joi.object({
    date: Joi.date()
        .default(() => new Date())
        .messages({
            'date.base': 'Date must be a valid date',
            'any.default': 'Date defaults to now if not provided'
        }),

    deposit: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Deposit must be a number',
            'number.integer': 'Deposit must be an integer',
            'number.min': 'Deposit cannot be negative',
            'any.default': 'Deposit defaults to 0 if not provided'
        }),

    status: Joi.string()
        .valid(...Object.values(ORDER_STATUS))
        .required()
        .messages({
            'string.base': 'Status must be a string',
            'any.only': 'Status must be one of: ' + ORDER_STATUS.join(', '),
            'any.required': 'Status is required'
        }),

    userId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'User ID must be a string',
            'string.guid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
        }),

    framePrice: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Frame price must be a number.',
            'number.integer': 'Frame price must be an integer.',
            'number.min': 'Frame price cannot be less than 0.',
            'any.required': 'Frame price is required.'
        }),

    productPrice: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Product price must be a number.',
            'number.integer': 'Product price must be an integer.',
            'number.min': 'Product price cannot be less than 0.',
            'any.required': 'Product price is required.'
        }),

    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'Product ID must be a string.',
            'string.guid': 'Product ID must be a valid UUID.',
            'any.required': 'Product ID is required.'
        })
});

const updateSchema = Joi.object({
    date: Joi.date(),

    deposit: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Deposit must be a number',
            'number.integer': 'Deposit must be an integer',
            'number.min': 'Deposit cannot be negative',
        }),

    status: Joi.string()
        .valid(...Object.values(ORDER_STATUS))
        .messages({
            'string.base': 'Status must be a string',
            'any.only': 'Status must be one of: ' + ORDER_STATUS.join(', '),
        }),
    framePrice: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Frame price must be a number.',
            'number.integer': 'Frame price must be an integer.',
            'number.min': 'Frame price cannot be less than 0.',
        }),
    productPrice: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Product price must be a number.',
            'number.integer': 'Product price must be an integer.',
            'number.min': 'Product price cannot be less than 0.',
        }),
    productId: Joi.string()
        .uuid()
        .messages({
            'string.base': 'Product ID must be a string.',
            'string.guid': 'Product ID must be a valid UUID.',
        })
});

module.exports = { 
    createSchema,
    updateSchema
};
