const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().min(1).max(255).required()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'string.max': 'Name cannot exceed 255 characters',
            'any.required': 'Name is required'
        }),
    surename: Joi.string().min(1).max(255).required()
        .messages({
            'string.base': 'Surname must be a string',
            'string.empty': 'Surname cannot be empty',
            'string.max': 'Surname cannot exceed 255 characters',
            'any.required': 'Surname is required'
        }),
    sphereL: Joi.string().allow('').messages({
        'string.base': 'Sphere (L) value must be a string',
    }),
    cylinderL: Joi.string().allow('').messages({
        'string.base': 'Cylinder (L) value must be a string',
    }),
    axisL: Joi.string().allow('').messages({
        'string.base': 'Axis (L) value must be a string',
    }),
    sphereR: Joi.string().allow('').messages({
        'string.base': 'Sphere (R) value must be a string',
    }),
    cylinderR: Joi.string().allow('').messages({
        'string.base': 'Cylinder (R) value must be a string',
    }),
    axisR: Joi.string().allow('').messages({
        'string.base': 'Axis (R) value must be a string',
    }),
});


const updateSchema = Joi.object({
    name: Joi.string().min(1).max(255)
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'string.max': 'Name cannot exceed 255 characters',
        }),
    surename: Joi.string().min(1).max(255)
        .messages({
            'string.base': 'Surname must be a string',
            'string.empty': 'Surname cannot be empty',
            'string.max': 'Surname cannot exceed 255 characters',
        }),
    sphereL: Joi.string().allow('')
        .messages({
            'string.base': 'Sphere (L) value must be a string',
        }),
    cylinderL: Joi.string().allow('')
        .messages({
            'string.base': 'Cylinder (L) value must be a string',
        }),
    axisL: Joi.string().allow('')
        .messages({
            'string.base': 'Axis (L) value must be a string',
        }),
    sphereR: Joi.string().allow('')
        .messages({
            'string.base': 'Sphere (R) value must be a string',
        }),
    cylinderR: Joi.string().allow('')
        .messages({
            'string.base': 'Cylinder (R) value must be a string',
        }),
    axisR: Joi.string().allow('')
        .messages({
            'string.base': 'Axis (R) value must be a string',
        }),
});

module.exports = { 
    createSchema,
    updateSchema
};
