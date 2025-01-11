const prisma = require('../../config/prisma.config.js');
const log = require('electron-log')
const { startOfDay, endOfDay, startOfWeek, startOfMonth, startOfYear } = require('date-fns');

const createOne = async (data) => {
    try {
        return await prisma.order.create({
            data,
            select: {
                id: true,
                deposit: true,
                status: true,
                createdAt: true, 
                updatedAt: true,
                date: true,
                framePrice: true,
                productPrice: true,
                user: true,
                productId:true,
                userId: true,
                product: {
                    select: {
                        id: true,
                        typeId: true,
                        subTypeId: true,
                        type: {
                            select: {
                                name: true
                            }
                        },
                        subType: {
                            select: {
                                name: true
                            }
                       }
                    },
                }
            }
        });
    } catch (error) {
        throw new Error('Error in creating an order: ' + error.message);
    }
}

const findMany = async ({ page, limit, orderField, orderBy, userId, productId, status, date }) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                ...(userId && { userId }),
                ...(status && { status }),
                ...(productId && { productId }),
                ...(date && {
                    date: {
                        equals: new Date(date),
                    },
                }),
            },
            select: {
                id: true,
                deposit: true,
                status: true,
                createdAt: true, 
                updatedAt: true,
                date: true,
                framePrice: true,
                productPrice: true,
                user: true,
                userId: true,
                productId: true,
                product: {
                    select: {
                        id: true,
                        typeId: true,
                        subTypeId: true,
                        type: {
                            select: {
                                name: true
                            }
                        },
                        subType: {
                            select: {
                                name: true
                            }
                       }
                    },
                }
            },
            take: limit,
            skip: page ? (page - 1) * limit : undefined,
            orderBy: { [orderField]: orderBy },
        });
        const totalElements = await prisma.order.count({
            where: {
              ...(userId && { userId }),
              ...(status && { status }),
              ...(productId && { productId }),
              ...(date && { date: { equals: new Date(date) } }),
            },
          })
        const pagination = {
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalElements / limit),
            totalElements: totalElements,
            hasNext: page * limit < totalElements,
        }
        return {
            orders, 
            pagination
        }
    } catch (error) {
        throw new Error('Error in finding many products: ' + error.message);
    }
}

const _findMany = async () => {
    try {
        return await prisma.order.findMany({});
    } catch (error) {
        throw new Error('Error in finding many orders: ' + error.message);
    }
}

const findUnique = async (id) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                deposit: true,
                status: true,
                createdAt: true, 
                updatedAt: true,
                date: true,
                framePrice: true,
                productPrice: true,
                user: true,
                product: true
            }
        });

        let orderTotalPrice = 0;
        
        order.totalPrice = orderTotalPrice
        return order;        
    } catch (error) {
        throw new Error('Error in finding an order: ' + error.message);
    }
}

const updateOne = async (id, data) => {
    try {
        return await prisma.order.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error('Error in updating an order: ' + error.message);
    }
}

const findBy = async (where) => {
    try {
        return await prisma.order.findMany({
            where: where
        });
    } catch (error) {
        throw new Error('Error in finding orders by filter: ' + error.message);
    }
}

const deleteById = async (id) => {
    try {
        return await prisma.order.delete({
            where: { id },
        });
       
    } catch (error) {
        throw new Error('Error in deleting an order: ' + error.message);
    }
}

const getTurnOver = async () =>  {
    try {
        const now = new Date();
        const filters = {
            day: {
              gte: startOfDay(now),
              lt: endOfDay(now),
            },
            week: {
              gte: startOfWeek(now),
              lt: endOfDay(now),
            },
            month: {
              gte: startOfMonth(now),
              lt: endOfDay(now),
            },
            year: {
              gte: startOfYear(now),
              lt: endOfDay(now),
            },
        };

        return await Promise.all(
            Object.entries(filters).map(
                async ([key, filter]) => {
                    const revenue = await prisma.order.aggregate({
                        where: { 
                            date: filter,
                            status: 'Complétée'
                        },
                        _sum: { productPrice: true, framePrice: true }
                    })
                    return { 
                        period: key, 
                        revenue: (revenue._sum.productPrice || 0) + (revenue._sum.framePrice || 0) 
                    };
                }
            )
        )
        
    } catch (error) {
        throw new Error('Error in getting turnover: ' + error.message);
    }
}

const getProductsSold = async () =>  {
    try {
        const now = new Date();
        const filters = {
            day: {
              gte: startOfDay(now),
              lt: endOfDay(now),
            },
            week: {
              gte: startOfWeek(now),
              lt: endOfDay(now),
            },
            month: {
              gte: startOfMonth(now),
              lt: endOfDay(now),
            },
            year: {
              gte: startOfYear(now),
              lt: endOfDay(now),
            },
        };

        return await Promise.all(
            Object.entries(filters).map(async ([key, filter]) => {
              const products = await prisma.order.groupBy({
                by: ['productId'],
                where: { 
                    date: filter,
                    status: 'Complétée'
                },
                _count: { productId: true },
                orderBy: { _count: { productId: 'desc' } },
              });
      
              return {
                period: key,
                items: products.map((item) => ({
                  productId: item.productId,
                  count: item._count.productId,
                })),
              };
            })
          );
        
    } catch (error) {
        throw new Error('Error in getting products sold: ' + error.message);
    }
}


module.exports = {
    createOne,
    findMany,
    findUnique,
    updateOne,
    findBy,
    _findMany,
    deleteById,
    getTurnOver,
    getProductsSold
}
