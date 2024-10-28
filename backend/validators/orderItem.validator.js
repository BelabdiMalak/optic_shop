const Joi = require('joi');

const createSchema = Joi.object({
    framePrice: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Frame price must be a number.',
            'number.integer': 'Frame price must be an integer.',
            'number.min': 'Frame price cannot be less than 0.',
            'any.required': 'Frame price is required.'
        }),
    productPrice: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Product price must be a number.',
            'number.integer': 'Product price must be an integer.',
            'number.min': 'Product price cannot be less than 0.',
            'any.required': 'Product price is required.'
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Quantity must be a number.',
            'number.integer': 'Quantity must be an integer.',
            'number.min': 'Quantity must be at least 1.'
        }),
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'Product ID must be a string.',
            'string.guid': 'Product ID must be a valid UUID.',
            'any.required': 'Product ID is required.'
        }),
    orderId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'Order ID must be a string.',
            'string.guid': 'Order ID must be a valid UUID.',
            'any.required': 'Order ID is required.'
        })
});

const updateSchema = Joi.object({
    framePrice: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Frame price must be a number.',
            'number.integer': 'Frame price must be an integer.',
            'number.min': 'Frame price cannot be less than 0.'
        }),
    productPrice: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Product price must be a number.',
            'number.integer': 'Product price must be an integer.',
            'number.min': 'Product price cannot be less than 0.'
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .messages({
            'number.base': 'Quantity must be a number.',
            'number.integer': 'Quantity must be an integer.',
            'number.min': 'Quantity must be at least 1.'
        }),
    productId: Joi.string()
        .uuid()
        .messages({
            'string.base': 'Product ID must be a string.',
            'string.guid': 'Product ID must be a valid UUID.'
        }),
    orderId: Joi.string()
        .uuid()
        .messages({
            'string.base': 'Order ID must be a string.',
            'string.guid': 'Order ID must be a valid UUID.'
        })
}).min(1).messages({
    'object.min': 'At least one field is required for update.'
});

module.exports = {
    createSchema,
    updateSchema
};
