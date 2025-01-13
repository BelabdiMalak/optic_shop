const Joi = require('joi');


const createSchema = Joi.object({
    stockQuantity: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Stock quantity must be a number',
            'number.integer': 'Stock quantity must be an integer',
            'number.min': 'Stock quantity cannot be negative',
        }),

    typeId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'Type ID must be a string',
            'string.guid': 'Type ID must be a valid UUID',
            'any.required': 'Type ID is required'
        }),

    subTypeId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.base': 'SubType ID must be a string',
            'string.guid': 'SubType ID must be a valid UUID',
            'any.required': 'SubType ID is required'
        }),
    
    category: Joi.string()
        .valid('torique', 'spherique'),
    
    sphere: Joi
        .number(),

    cylinder: Joi
        .number()
});


const updateSchema = Joi.object({
    stockQuantity: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Stock quantity must be a number',
            'number.integer': 'Stock quantity must be an integer',
            'number.min': 'Stock quantity cannot be negative',
        }),

    // typeId: Joi.string()
    //     .uuid()
    //     .messages({
    //         'string.base': 'Type ID must be a string',
    //         'string.guid': 'Type ID must be a valid UUID',
    //         'any.required': 'Type ID is required'
    //     }),

    // subTypeId: Joi.string()
    //     .uuid()
    //     .messages({
    //         'string.base': 'SubType ID must be a string',
    //         'string.guid': 'SubType ID must be a valid UUID',
    //         'any.required': 'SubType ID is required'
    //     }),
});

module.exports = { 
    createSchema,
    updateSchema
};
