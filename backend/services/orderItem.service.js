const orderItemValidator = require('../validators/orderItem.validator');
const orderItemModel = require('../models/orderItem.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');

const createOrderItem = async (data) => {
    try {
        // Validate data
        const { error } = orderItemValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        // Check if the product exists
        const product = await productModel.findUnique(data.productId);
        if (!product) {
            return {
                status: false,
                message: 'Invalid product ID'
            };
        }

        // Check if the order exists
        const order = await orderModel.findUnique(data.orderId);
        if (!order) {
            return {
                status: false,
                message: 'Invalid order ID'
            };
        }

        // Create the order item
        const createdOrderItem = await orderItemModel.createOne(data);
        return {
            status: true,
            message: 'Order item created successfully',
            data: createdOrderItem
        };
    } catch (error) {
        throw new Error(`Error in creating order item (service): ${error}`);
    }
};

const updateOrderItem = async (id, data) => {
    try {
        // Fetch existing order item
        const orderItem = await orderItemModel.findUnique(id);
        if (!orderItem) {
            return {
                status: false,
                message: 'Order item not found'
            };
        }

        // Validate data
        const { error } = orderItemValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.message
            };
        }

        // Check if product ID is valid (if updating)
        if (data.productId) {
            const product = await productModel.findUnique(data.productId);
            if (!product) {
                return {
                    status: false,
                    message: 'Invalid product ID'
                };
            }
        }

        // Update the order item
        const updatedOrderItem = await orderItemModel.updateOne(id, data);
        return {
            status: true,
            message: 'Order item updated successfully',
            data: updatedOrderItem
        };
    } catch (error) {
        throw new Error(`Error in updating order item (service): ${error}`);
    }
};

const findOrderItemById = async (id) => {
    try {
        // Fetch order item by ID
        const orderItem = await orderItemModel.findUnique(id);
        if (!orderItem) {
            return {
                status: false,
                message: 'Order item not found'
            };
        }

        return {
            status: true,
            message: 'Order item fetched successfully',
            data: orderItem
        };
    } catch (error) {
        throw new Error(`Error in finding order item by ID (service): ${error}`);
    }
};

const getOrderItems = async ({
    page = 1,
    limit = 10,
    orderField = 'createdAt',
    orderBy = 'desc',
    productId,
    orderId
}) => {
    try {
        // Fetch paginated and filtered order items
        const { orderItems, pagination } = await orderItemModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            productId,
            orderId
        });

        return {
            status: true,
            message: 'Order items fetched successfully',
            data: orderItems,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting order items (service): ${error}`);
    }
};

module.exports = {
    createOrderItem,
    updateOrderItem,
    findOrderItemById,
    getOrderItems
};
