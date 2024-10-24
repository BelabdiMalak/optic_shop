const orderValidator = require('../validators/order.validator');
const orderModel = require('../models/order.model');

const createOrder = async (data) => {
    try {
        const { error } = orderValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const createdOrder = await orderModel.createOne(data);
        return {
            status: true,
            message: 'Order created successfully',
            data: createdOrder
        };
    } catch (error) {
        throw new Error(`Error in creating order (service): ${error}`);
    }
};

const updateOrder = async (id, data) => {
    try {
        const order = await orderModel.findUnique(id);
        if (!order) {
            return {
                status: false,
                message: 'Order not found'
            };
        }

        const { error } = orderValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        const updatedOrder = await orderModel.updateOne(id, data);
        return {
            status: true,
            message: 'Order updated successfully',
            data: updatedOrder
        };
    } catch (error) {
        throw new Error(`Error in updating order (service): ${error}`);
    }
};

const findOrderById = async (id) => {
    try {
        const order = await orderModel.findUnique(id);
        if (!order) {
            return {
                status: false,
                message: 'Order not found'
            };
        }

        return {
            status: true,
            message: 'Order fetched successfully',
            data: order
        };
    } catch (error) {
        throw new Error(`Error in finding order by ID (service): ${error}`);
    }
};

const getOrders = async ({ 
    page = 1, 
    limit = 10, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    status,
    customerId
}) => {
    try {
        const orders = await orderModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            status,
            customerId
        });

        return {
            status: true,
            message: 'Orders fetched successfully',
            data: orders
        };
    } catch (error) {
        throw new Error(`Error in getting orders (service): ${error}`);
    }
};

module.exports = {
    createOrder,
    updateOrder,
    findOrderById,
    getOrders
};
