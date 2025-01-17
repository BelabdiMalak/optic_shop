import { ProductDetail } from "./details.type";
import { Client } from "./client.type";
import { Product } from "./product.type";

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
    user?: Client;
    product?: Product;
    details?: ProductDetail;
    detailsId?: string;
    category?: string;
    sphere?: string;
    cylinder?: string;
  };