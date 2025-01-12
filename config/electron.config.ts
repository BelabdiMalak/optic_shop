import { StockType } from 'types/stock.type';
import { Client } from '../types/client.type';
import { Product } from '../types/product.type';
import { ResponseType } from '../types/response.type';
import { Order } from 'types/order.type';

export interface ElectronAPI {
    // Users
    getUsers: (filter: any) => Promise<ResponseType>;
    createUser: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ status: boolean; message: string; data: Client }>;
    deleteUser: (id: string) => Promise<ResponseType>
    updateUser: (id: string, data: any) => Promise<ResponseType>

    // Products
    getProducts: (filter: any) => Promise<ResponseType>;
    createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'subType'>) => Promise<{ status: boolean; message: string; data: Product }>;
    getType: (filter: any) => Promise<ResponseType>
    getSubType: (filter: any) => Promise<ResponseType>
    getTypes: (filter: any) => Promise<ResponseType>
    getSubTypes: (filter: any) => Promise<ResponseType>

    // Stocks
    getStocks: (filter: any) => Promise<ResponseType>
    createStock: (data: Omit<StockType, 'id' | 'product' | 'createdAt' | 'updatedAt'>) => Promise<ResponseType>
    updateStock: (id: string, data: any) => Promise<ResponseType>
    deleteStock: (id: string) => Promise<ResponseType>

    // Orders
    getOrders: (filter: any) => Promise<ResponseType>
    createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'| 'date'>) => Promise<ResponseType>
    deleteOrder: (id: string) => Promise<ResponseType>
    updateOrder: (id: string, data: any) => Promise<ResponseType>
    getTurnOver: () => Promise<ResponseType>
    getProductsSold: () => Promise<ResponseType>
  }
  
  declare global {
    interface Window {
      electron: ElectronAPI;
    }
  }
  