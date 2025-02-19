import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = true;
  isMobile = false;
  userEmail: string | null = null;
  userRole: string | null = null;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi-home',
      route: '/dashboard',
    },
    {
      label: 'Products',
      icon: 'pi-shopping-cart',
      route: '/products',
    },
    {
      label: 'Invoices',
      icon: 'pi-file',
      route: '/invoices',
    },
    {
      label: 'Users',
      icon: 'pi-users',
      route: '/users',
      roles: ['admin']
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = this.authService.getUserRole();
    this.menuItems = this.menuItems.filter(item => 
      !item.roles || item.roles.includes(this.userRole || '')
    );
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}