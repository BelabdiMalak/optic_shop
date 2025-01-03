export interface Type {
  id: string; 
  name: string;

  // Metadata
  createdAt: Date; 
  updatedAt: Date;

  // Relations
  subTypes: SubType[];
  products: Product[]; 
}

export interface SubType {
  id: string; 
  name: string;

  // Metadata
  createdAt: Date; 
  updatedAt: Date;

  // Relations
  typeId: string;
  type: Type;
  products: Product[]; 
}

export interface Product {
  id: string; 
  typeId: string;
  subTypeId: string; 
  stockQuantity: number;

  // Metadata
  createdAt: Date; 
  updatedAt: Date;

  // Relations
  type: Type; 
  subType: SubType;
}
