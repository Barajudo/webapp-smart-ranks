import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
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
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      route: '/analytics',
      roles: ['admin']
    }
  ];

  filteredMenuItems: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = this.authService.getUserRole();
    this.filterMenuItems();
  }

  filterMenuItems() {
    this.filteredMenuItems = this.menuItems.filter(item => {
      if (!item.roles) {
        return true;
      }
      return this.userRole && item.roles.includes(this.userRole);
    });
  }

  logout() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres cerrar sesión?',
      header: 'Confirmación de cierre de sesión',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión cerrada correctamente' });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}