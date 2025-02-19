import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../users/services/users.service';
import { InvoicesService } from '../../../invoices/services/invoices.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../users/interfaces/user.interface';
import { Invoice } from '../../../invoices/interfaces/invoice.interface';

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

  constructor(
    private usersService: UsersService,
    private invoicesService: InvoicesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
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
