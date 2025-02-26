import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../users/services/users.service';
import { InvoicesService } from '../../../invoices/services/invoices.service';
import { ProductsService } from '../../../products/services/products.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../users/interfaces/user.interface';
import { Invoice } from '../../../invoices/interfaces/invoice.interface';
import { Product } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  providers: [MessageService]
})
export class AnalyticsComponent implements OnInit {
  users: User[] = [];
  selectedUserId: string = '';
  invoices: Invoice[] = [];
  monthlyCount = 0;
  loading = false;
  productsMap: Map<string, Product> = new Map();

  constructor(
    private usersService: UsersService,
    private invoicesService: InvoicesService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllProducts();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (allUsers) => {
        this.users = allUsers.filter(u => u.role === 'user');
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
      }
    });
  }

  loadAllProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.productsMap = new Map(
          data.map((product) => [product._id!, product])
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

  getProductName(productId: string): string {
    const product = this.productsMap.get(productId);
    return product ? product.name : 'Producto no encontrado';
  }

  onUserChange() {
    if (!this.selectedUserId) {
      this.invoices = [];
      this.monthlyCount = 0;
      return;
    }
    this.loading = true;
    this.invoicesService.getInvoicesByUser(this.selectedUserId).subscribe({
      next: (allInvoices) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        this.invoices = allInvoices.filter((inv: any) => {
          const invDate = new Date(inv.createdAt);
          return invDate >= oneMonthAgo;
        });
        this.invoicesService.getMonthlyPurchases(this.selectedUserId).subscribe({
          next: (count) => {
            this.monthlyCount = count;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.monthlyCount = 0;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message
            });
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.invoices = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
      }
    });
  }
}