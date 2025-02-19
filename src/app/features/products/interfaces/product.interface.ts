export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

export interface CreateProductDto extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateProductDto extends Partial<Product> {}