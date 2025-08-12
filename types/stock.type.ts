import { ProductDetail } from './details.type';
import { Product } from './product.type';

export interface StockType {
    id: string;
    date: string;
    type: string;
    quantity: number;
    productId: string;
    product?: Product;
    details?: ProductDetail;
    detailsId?: string;
    category?: string;
    sphere?: string;
    cylinder?: string;
    // sphereR?: string;
    // cylinderR?: string;
  }