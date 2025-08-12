import { Product } from './product.type';

export interface ProductDetail {
    id?: string;
    // sphereL?: string;
    // cylinderL?: string;
    sphere?: string;
    cylinder?: string;
    quantity?: number;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
    productId?: string;
    product?: Product;
}