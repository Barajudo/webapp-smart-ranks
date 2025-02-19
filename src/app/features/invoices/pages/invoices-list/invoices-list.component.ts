import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { ProductsService } from '../../../products/services/products.service';
import { Invoice, CreateInvoiceDto } from '../../interfaces/invoice.interface';
import { Product } from '../../../products/interfaces/product.interface';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  providers: [MessageService],
})
export class InvoicesListComponent implements OnInit {
  invoices: Invoice[] = [];
  products: Product[] = [];
  loading = false;
  createDialog = false;
  viewDialog = false;
  selectedProducts: { productId: string; quantity: number }[] = [];
  productsMap: Map<string, Product> = new Map();
  currentUserRole: string = '';
  currentUserId: string = '';
  selectedInvoice: any;

  constructor(
    private invoicesService: InvoicesService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUserRole = localStorage.getItem('userRole') || '';
    this.currentUserId = localStorage.getItem('userId') || '';

    this.loadInvoices();
    this.loadProducts();
  }

  loadInvoices() {
    this.loading = true;

    if (this.currentUserRole === 'admin') {
      this.invoicesService.getInvoices().subscribe({
        next: (data) => {
          this.invoices = data;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          this.loading = false;
        }
      });
    } else {
      this.invoicesService.getInvoicesByUser(this.currentUserId).subscribe({
        next: (data) => {
          console.log({data})
          this.invoices = data;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          this.loading = false;
        }
      });
    }
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data.filter(
          (p) => p.status === 'active' && p.stock > 0
        );
        this.productsMap = new Map(
          this.products.map((product) => [product._id!, product])
        );
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  viewInvoice(invoice: Invoice) {
    if (this.currentUserRole !== 'admin') {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only admin can view invoice details'
      });
      return;
    }
    this.selectedInvoice = invoice;
    this.viewDialog = true;
  }
  

  getProductName(productId: string): string {
    const product = this.productsMap.get(productId);
    return product ? product.name : 'Product not found';
  }

  getProductStock(productId: string): number {
    return this.productsMap.get(productId)?.stock || 0;
  }

  getTotalAmount(items: { quantity: number; price: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  createInvoice() {
    if (this.selectedProducts.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one product',
      });
      return;
    }

    const data: CreateInvoiceDto = {
      items: this.selectedProducts,
    };

    this.invoicesService.createInvoice(data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Invoice created successfully',
        });
        this.loadInvoices();
        this.createDialog = false;
        this.selectedProducts = [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  addProduct(product: Product) {
    if (!product._id) return;
    console.log({ product });
    const index = this.selectedProducts.findIndex(
      (p) => p.productId === product._id
    );
    console.log({ index });
    if (index === -1) {
      this.selectedProducts.push({
        productId: product._id,
        quantity: 1,
      });
    } else {
      const newQuantity = this.selectedProducts[index].quantity + 1;
      if (newQuantity <= this.getProductStock(product._id)) {
        this.selectedProducts[index].quantity = newQuantity;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Not enough stock available',
        });
      }
    }
  }

  removeProduct(productId: string) {
    this.selectedProducts = this.selectedProducts.filter(
      (p) => p.productId !== productId
    );
  }

  calculateSubtotal(item: { quantity: number; productId: string }): number {
    const product = this.productsMap.get(item.productId);
    if (!product) return 0;
    return product.price * item.quantity;
  }

  calculateTotal(): number {
    return this.selectedProducts.reduce((total, item) => {
      return total + this.calculateSubtotal(item);
    }, 0);
  }

  updateQuantity(productId: string, newQuantity: number): void {
    const product = this.productsMap.get(productId);
    if (!product) return;

    const index = this.selectedProducts.findIndex(
      (p) => p.productId === productId
    );
    if (index === -1) return;

    if (newQuantity <= product.stock) {
      this.selectedProducts[index].quantity = newQuantity;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Not enough stock available',
      });
    }
  }

  openCreateDialog() {
    this.createDialog = true;
    this.selectedProducts = [];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
