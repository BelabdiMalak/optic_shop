const stockValidator = require('../validators/stock.validator');
const productModel = require('../models/product.model');
const { STOCK_TYPE } = require('../const/stock.const');
const stockModel = require('../models/stock.model');
const prisma = require('../../config/prisma.config');
const { log } = require('console');

const createStock = async (data) => {
    try {
        const { error } = stockValidator.createSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        const product = await productModel.findUnique(data.productId);
        if (!product)
            return {
                status: false,
                message: 'Invalid product ID'
            }
        
        if (data.type === STOCK_TYPE.OUT && data.quantity > product.stockQuantity)
            return {
                status: false,
                message: `Insufficient stock quantity`,
                data: {
                    quantity: product.stockQuantity
                }
            }

        data.type === STOCK_TYPE.IN && await productModel.updateOne(
            product.id,
            { stockQuantity: (product.stockQuantity + data.quantity)}
        )

        log(data.type === STOCK_TYPE.OUT && !data.category)
        data.type === STOCK_TYPE.OUT && !data.category && await productModel.updateOne(
            product.id,
            { stockQuantity: (product.stockQuantity - data.quantity)}
        )

        // Specific handling for type = 'GLASS' to add/update product details
        const productDetails = data.category && await prisma.productDetail.findFirst({
            where: {
                category: data.category,
                productId: data.productId,
                sphereL: data.sphereL, // put default 0 in frontend?
                cylinderL: data.cylinderL,
                sphereR: data.sphereR,
                cylinderR: data.cylinderR,
            }
        })

        // if not enough quantity or type=out and productdetails does not exist
        if (data.category && data.type === STOCK_TYPE.OUT && 
            (!productDetails || data.quantity > productDetails.quantity))
            return {
                status: false,
                message: 'Insufficient',
                data: {
                    quantity: productDetails ? productDetails.quantity : 0
                }
            }

        // in case product details exists and has quantity update stock
        data.category && productDetails && data.type === STOCK_TYPE.IN && await prisma.productDetail.update({
            where: { id: productDetails.id },
            data: {
                quantity: { increment: data.quantity }
            }
        })

        data.category && productDetails && data.type === STOCK_TYPE.OUT && await prisma.productDetail.update({
            where: { id: productDetails.id },
            data: {
                quantity: { decrement: data.quantity }
            }
        })

        data.category && productDetails && data.type === STOCK_TYPE.OUT && await productModel.updateOne(
            product.id,
            { stockQuantity: (product.stockQuantity - data.quantity)}
        )
        
        const createdDetails = data.category && !productDetails && await prisma.productDetail.create({
            data: {
                productId: data.productId,
                category: data.category,
                quantity: data.quantity,
                sphereL: data.sphereL,
                cylinderL: data.cylinderL,
                sphereR: data.sphereR,
                cylinderR: data.cylinderR,
            }
        })

        const createdStock = await stockModel.createOne({
            type: data.type,
            date: new Date(data.date),
            quantity: data.quantity,
            productId: data.productId,
            ...(data.category && {detailsId: productDetails ? productDetails.id : createdDetails.id}),
        });

        return {
            status: true,
            message: 'Stock created successfully',
            data: createdStock
        };
    } catch (error) {
        throw new Error(`Error in creating stock (service): ${error}`);
    }
};

const updateStock = async (id, data) => {
    try {
        // Vérifier si le stock existe
        const stock = await stockModel.findUnique(id);
        if (!stock) {
            return {
                status: false,
                message: 'Stock not found'
            };
        }

        // Validation des données
        const { error } = stockValidator.updateSchema.validate(data);
        if (error) {
            return {
                status: false,
                message: 'Validation error',
                data: error.details.map((err) => err.message)
            };
        }

        // Vérifier si le détail du produit existe déjà
        const details = data.detailsId 
            ? await prisma.productDetail.findUnique({ where: { id: data.detailsId } }) 
            : null;

        // Déterminer les nouvelles valeurs
        const newCategory = data.category || details?.category;
        const newSphereL = data.sphereL || details?.sphereL;
        const newCylinderL = data.cylinderL || details?.cylinderL;
        const newSphereR = data.sphereR || details?.sphereR;
        const newCylinderR = data.cylinderR || details?.cylinderR;

        // Vérifier si un détail de produit avec ces caractéristiques existe déjà
        let newDetails = await prisma.productDetail.findUnique({
            where: {
                productId_sphereL_cylinderL_sphereR_cylinderR_category: {
                    productId: data.productId,
                    sphereL: newSphereL,
                    cylinderL: newCylinderL,
                    sphereR: newSphereR,
                    cylinderR: newCylinderR,
                    category: newCategory,
                },
            },
        });

        // Si `newDetails` n'existe pas, on le crée
        if (!newDetails) {
            newDetails = await prisma.productDetail.create({
                data: {
                    productId: data.productId,
                    sphereL: newSphereL,
                    cylinderL: newCylinderL,
                    sphereR: newSphereR,
                    cylinderR: newCylinderR,
                    category: newCategory,
                    quantity: 0, // Valeur initiale, peut être ajustée
                },
            });
        }

        // Vérifier si `details` est différent de `newDetails`
        if (newDetails.id !== details?.id) {
            // Mettre à jour le stock avec le nouvel ID de détails
            await stockModel.updateOne(id, { detailsId: newDetails.id });

            // Gestion des ajustements de stock
            if (stock.type === STOCK_TYPE.OUT) {
                await prisma.productDetail.update({
                    where: { id: newDetails.id },
                    data: { quantity: { decrement: stock.quantity } }
                });

                if (details) {
                    await prisma.productDetail.update({
                        where: { id: details.id },
                        data: { quantity: { increment: stock.quantity } }
                    });
                }
            }

            if (stock.type === STOCK_TYPE.IN) {
                await prisma.productDetail.update({
                    where: { id: newDetails.id },
                    data: { quantity: { increment: stock.quantity } }
                });

                if (details) {
                    await prisma.productDetail.update({
                        where: { id: details.id },
                        data: { quantity: { decrement: stock.quantity } }
                    });
                }
            }
        } 

        return {
            status: true,
            message: 'Stock updated successfully',
        };
    } catch (error) {
        throw new Error(`Error in updating stock (service): ${error.message}`);
    }
};

const deleteStock = async (id) => {
    try {
        const stock = await stockModel.findUnique(id);
        if (!stock) {
            return {
                status: false,
                message: 'Stock not found'
            };
        }

        await stockModel.deleteOne(id);
        return {
            status: true,
            message: 'Stock deleted successfully'
        };
    } catch (error) {
        throw new Error(`Error in deleting stock (service): ${error}`);
    }
};

const findStockById = async (id) => {
    try {
        const stock = await stockModel.findUnique(id);
        if (!stock) {
            return {
                status: false,
                message: 'Stock not found'
            };
        }

        return {
            status: true,
            message: 'Stock fetched successfully',
            data: stock
        };
    } catch (error) {
        throw new Error(`Error in finding stock by ID (service): ${error}`);
    }
};

const getStocks = async ({ 
    page, 
    limit, 
    orderField = 'createdAt', 
    orderBy = 'desc',
    productId,
    status
}) => {
    try {
        const { stocks, pagination } = await stockModel.findMany({
            page,
            limit,
            orderField,
            orderBy,
            productId,
            status
        });

        return {
            status: true,
            message: 'Stocks fetched successfully',
            data: stocks,
            pagination: pagination
        };
    } catch (error) {
        throw new Error(`Error in getting stocks (service): ${error}`);
    }
};

module.exports = {
    createStock,
    updateStock,
    findStockById,
    getStocks,
    deleteStock
};
