import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  providers: [ConfirmationService, MessageService]
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  userEmail: string | null = null;
  userRole: string | null = null;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      route: '/products'
    },
    {
      label: 'Invoices',
      icon: 'pi pi-file',
      route: '/invoices'
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      route: '/users'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = this.authService.getUserRole();
    
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully' });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}