import { Product, User } from "@prisma/client";

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
  };