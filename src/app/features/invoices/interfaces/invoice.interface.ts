export interface InvoiceItem {
  productId: string;
  quantity: number;
  price?: number;
  subtotal?: number;
}

export interface Invoice {
  id?: string;
  userId: string;
  items: InvoiceItem[];
  total: number;
  createdAt?: Date;
}

export interface CreateInvoiceDto {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}