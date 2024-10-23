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
    sphere: Joi.string().required()
        .messages({
            'string.base': 'Sphere value must be a string',
            'any.required': 'Sphere is required',
        }),
    cylinder: Joi.string().required()
        .messages({
            'string.base': 'Cylinder value must be a string',
            'any.required': 'Cylinder is required',
        }),
    axis: Joi.string().required()
        .messages({
            'string.base': 'Axis value must be a string',
            'any.required': 'Axis is required',
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
    sphere: Joi.string()
        .messages({
            'string.base': 'Sphere value must be a string',
        }),
    cylinder: Joi.string()
        .messages({
            'string.base': 'Cylinder value must be a string',
        }),
    axis: Joi.string()
        .messages({
            'string.base': 'Axis value must be a string',
        }),
});

module.exports = { 
    createSchema,
    updateSchema
};
