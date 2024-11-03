const orderValidator = require('../validators/order.validator');
const orderItemModel = require('../models/orderItem.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
var log = require('electron-log');

const createOrder = async (data) => {
    try {
        const { error } = orderValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        const user = await userModel.findUnique(data.userId);
        if (!user) {
            return {
                status: false,
                message: 'Invalid user ID'
            };
        }

        // Check products list
        const productIds = data.products.map(product => product.productId);
        const productsData = await productModel._findMany({ where: { id: { in: productIds } } });
        for (const product of data.products) {
            const productFromDB = productsData.find(pd => pd.id === product.productId);
            if (!productFromDB) 
                return {
                    status: false,
                    message: `Product ${product.productId} not found`
                };

            if (productFromDB.stockQuantity < product.quantity) 
                return {
                    status: false,
                    message: `Insufficient quantity for product ${product.productId}`,
                    data: {
                        quantity: productFromDB.stockQuantity
                    }
                };
        }

        const createdOrder = await orderModel.createOne({
            ...(data.date && { date: data.date }),
            ...(data.deposit && { deposit: data.deposit }),
            ...(data.status && { status: data.status }),
            ...(data.userId && { userId: data.userId })
        });
        const items = data.products.map(product => ({
            ...product,
            orderId: createdOrder.id
        }));
        await orderItemModel.createMany(items);

        // update product quantity
        data.products.forEach(async(product) => {
            await productModel.updateOne(
                product.productId,
                { stockQuantity: { decrement: product.quantity } }
            )
        })

        const order = await orderModel.findUnique(createdOrder.id);

        return {
            status: true,
            message: 'Order created successfully',
            data: order
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
                data: error.details.map((err) => err.message)
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
        const { orders, pagination } = await orderModel.findMany({
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
            data: orders,
            pagination: pagination
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
