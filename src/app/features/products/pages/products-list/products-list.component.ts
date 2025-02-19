import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: Product[] = [];
  product: Product = this.getEmptyProduct();
  productDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading products' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.product = this.getEmptyProduct();
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(product.id!).subscribe({
          next: () => {
            this.products = this.products.filter(val => val.id !== product.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
          }
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product.id) {
        this.productsService.updateProduct(this.product.id, this.product).subscribe({
          next: (product) => {
            this.products[this.findIndexById(this.product.id!)] = product;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          }
        });
      } else {
        this.productsService.createProduct(this.product).subscribe({
          next: (product) => {
            this.products.push(product);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = this.getEmptyProduct();
    }
  }

  private findIndexById(id: string): number {
    return this.products.findIndex(val => val.id === id);
  }

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'active'
    };
  }
}