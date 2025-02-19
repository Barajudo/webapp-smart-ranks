export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
  }
  
  export interface CreateProductDto extends Omit<Product, 'id'> {}
  export interface UpdateProductDto extends Partial<Product> {}