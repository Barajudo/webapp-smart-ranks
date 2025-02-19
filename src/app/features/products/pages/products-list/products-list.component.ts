import { Component, OnInit } from '@angular/core';
import {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: Product[] = [];
  product: Product = this.getEmptyProduct();
  productDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;
  currentUserRole: string = '';
  currentUserId: string = '';

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.currentUserRole = localStorage.getItem('userRole') || '';
    this.currentUserId = localStorage.getItem('userId') || '';
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
        this.loading = false;
      },
    });
  }

  openNew() {
    if (this.currentUserRole !== 'admin') {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only admin can create products',
      });
      return;
    }

    this.product = this.getEmptyProduct();
    this.submitted = false;
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    if (this.currentUserRole !== 'admin') {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only admin can delete products',
      });
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.name}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const productId = product._id;
        if (!productId) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product ID not found',
          });
          return;
        }

        this.productsService.deleteProduct(productId).subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully',
            });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Delete error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Error deleting product',
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  editProduct(product: Product) {
    if (this.currentUserRole !== 'admin') {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only admin can edit products',
      });
      return;
    }
    const transformedProduct: Product = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
    };
    this.product = transformedProduct;
    this.productDialog = true;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name) {
      if (this.product._id) {
        const updateData: UpdateProductDto = {
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          stock: this.product.stock,
          status: this.product.status,
        };

        this.productsService
          .updateProduct(this.product._id, updateData)
          .subscribe({
            next: (result) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product Updated',
              });
              this.loadProducts();
              this.productDialog = false;
              this.product = this.getEmptyProduct();
            },
            error: (error) => {
              console.error('Update error:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Error updating product',
              });
            },
          });
      } else {
        const createData: CreateProductDto = {
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          stock: this.product.stock,
          status: this.product.status,
        };

        this.productsService.createProduct(createData).subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product Created',
            });
            this.loadProducts();
            this.productDialog = false;
            this.product = this.getEmptyProduct();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Error creating product',
            });
          },
        });
      }
    }
  }

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'active',
    };
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
