import { Product, ProductDetail, User } from "@prisma/client";

export interface Order {
    id: string;
    date: string;
    deposit: number;
    status: string;
    userId: string;
    framePrice: number;
    productPrice: number;
    productId: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
    product?: Product;
    details?: ProductDetail;
    detailsId?: string;
    category?: string;
    sphere?: string;
    cylinder?: string;
  };