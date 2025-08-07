const orderValidator = require('../validators/order.validator');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
const { ORDER_STATUS } = require('../const/order.const');
const prisma = require('../../config/prisma.config');
const { log } = require('console');

const createOrder = async (data) => {
    try {
        const { error } = orderValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error
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
        const productData = await productModel.findUnique(data.productId);
        if (!productData) 
            return {
                status: false,
                message: `Product ${data.productId} not found`
            };

        // if (productData.stockQuantity < 1) 
        //     return {
        //         status: false,
        //         message: `Insufficient quantity for product ${data.productId}`,
        //         data: {
        //             quantity: productData.stockQuantity
        //         }
        //     };

        // const productDetails = data.category && await prisma.productDetail.findFirst({
        //     where: {
        //         category: data.category,
        //         productId: data.productId,
        //         sphereL: data.sphereL, // put default 0 in frontend?
        //         cylinderL: data.cylinderL,
        //         sphereR: data.sphereR, // put default 0 in frontend?
        //         cylinderR: data.cylinderR,
        //     }
        // })

        // if (data.category && (!productDetails || 1 > productDetails.quantity))
        //     return {
        //         status: false,
        //         message: 'Insufficient stock quantity',
        //         data: {
        //             quantity: productDetails ? productDetails.quantity : 0
        //         }
        //     }

        // data.category && productDetails && await prisma.productDetail.update({
        //     where: { id: productDetails.id },
        //     data: {
        //         quantity: (productDetails.quantity - 1)
        //     }
        // })
        const createdOrder = await orderModel.createOne({
            ...(data.date && { date: data.date }),
            ...(data.deposit && { deposit: data.deposit }),
            ...(data.status && { status: data.status }),
            ...(data.userId && { userId: data.userId }),
            ...(data.framePrice && { framePrice: data.framePrice }),
            ...(data.productPrice && { productPrice: data.productPrice }),
            ...(data.productId && { productId: data.productId }),
            // ...(data.category && { detailsId: productDetails.id })
        });

        // update product quantity
        // await productModel.updateOne(
        //     data.productId,
        //     { stockQuantity: { decrement: 1 } }
        // )

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

        // if (data.status && data.status === 'Annulée') {
        //     await productModel.updateOne(
        //         order.product.id,
        //         { stockQuantity: { increment: 1 } }
        //     )

        //     if (order.details) 
        //         await prisma.productDetail.update({
        //             where: { id: order.details.id },
        //             data: {
        //                 quantity: { increment: 1 }
        //             }
        //         })
        // }
        
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
    page, 
    limit, 
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

const deleteOrder = async (id) => {
    try {
        const order = await orderModel.findUnique(id);
        if (!order) {
            return {
                status: false,
                message: 'Order not found'
            };
        }

        if (order.status === 'Complétée') {
            return {
                status: false,
                message: 'Cannot delete a completed order'
            };
        }

        // await productModel.updateOne(
        //     order.product.id,
        //     { stockQuantity: { increment: 1 } }
        // )

        // if (order.details) 
        //     await prisma.productDetail.update({
        //         where: { id: order.details.id },
        //         data: {
        //             quantity: { increment: 1 }
        //         }
        //     })

        await orderModel.deleteById(id);
        return {
            status: true,
            message: 'Order deleted successfully',
        };
    } catch (error) {
        throw new Error(`Error in deleting order (service): ${error}`);
    }
};

const getTurnOver = async () => {
    try {
        const turnOver = await orderModel.getTurnOver();
        return {
            status: true,
            message: 'Turn over fetched successfully',
            data: turnOver
        };
    } catch (error) {
        throw new Error(`Error in getting turnover (service): ${error}`);
    }
}

const getProductsSold = async () => {
    try {
        const products = await orderModel.getProductsSold();
        return {
            status: true,
            message: 'Get Products sold fetched successfully',
            data: products
        };
    } catch (error) {
        throw new Error(`Error in getting products sold (service): ${error}`);
    }
}

module.exports = {
    createOrder,
    updateOrder,
    findOrderById,
    getOrders,
    deleteOrder,
    getTurnOver,
    getProductsSold
};
