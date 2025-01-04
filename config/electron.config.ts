import { StockType } from 'types/stock.type';
import { Client } from '../types/client.type';
import { Product } from '../types/product.type';
import { ResponseType } from '../types/response.type';
import { Order } from 'types/order.type';

export interface ElectronAPI {
    getUsers: (filter: any) => Promise<ResponseType>;
    createUser: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ status: boolean; message: string; data: Client }>;
    getProducts: (filter: any) => Promise<ResponseType>;
    createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'subType'>) => Promise<{ status: boolean; message: string; data: Product }>;
    getType: (filter: any) => Promise<ResponseType>
    getSubType: (filter: any) => Promise<ResponseType>
    getTypes: (filter: any) => Promise<ResponseType>
    getSubTypes: (filter: any) => Promise<ResponseType>
    getStocks: (filter: any) => Promise<ResponseType>
    createStock: (data: Omit<StockType, 'id' | 'product' | 'createdAt' | 'updatedAt'>) => Promise<ResponseType>
    getOrders: (filter: any) => Promise<ResponseType>
    createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'| 'date'>) => Promise<ResponseType>
  }
  
  declare global {
    interface Window {
      electron: ElectronAPI;
    }
  }
  