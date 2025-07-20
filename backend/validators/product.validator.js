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
    
    sphereL: Joi
        .number(),

    cylinderL: Joi
        .number(),
    sphereR: Joi
        .number(),
    cylinderR: Joi
        .number(),
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

const updateProductDetailsSchema = Joi.object({
    category: Joi.string().optional()
        .allow(null)
        .empty('')
        .valid('torique', 'spherique'),
    
    sphereL: Joi
        .number()
        .optional()
        .allow(null) // Allow `null` explicitly
        .empty('')   // Treat empty strings as `undefined`
        .messages({
            'number.base': 'Sphere (L) must be a number or empty'
        }),

    cylinderL: Joi
        .number()
        .optional()
        .allow(null) // Allow `null` explicitly
        .empty('')   // Treat empty strings as `undefined`
        .messages({
            'number.base': 'Cylinder (L) must be a number or empty'
        }),
    sphereR: Joi
        .number()
        .optional()
        .allow(null) // Allow `null` explicitly
        .empty('')   // Treat empty strings as `undefined`
        .messages({
            'number.base': 'Sphere (R) must be a number or empty'
        }),
    cylinderR: Joi
        .number()
        .optional()
        .allow(null) // Allow `null` explicitly
        .empty('')   // Treat empty strings as `undefined`
        .messages({
            'number.base': 'Cylinder (R) must be a number or empty'
        }),
        
});

module.exports = { 
    createSchema,
    updateSchema,
    updateProductDetailsSchema
};
