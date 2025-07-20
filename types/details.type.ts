import { Product } from './product.type';

export interface ProductDetail {
    id?: string;
    sphereL?: string;
    cylinderL?: string;
    sphereR?: string;
    cylinderR?: string;
    quantity?: number;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
    productId?: string;
    product?: Product;
}