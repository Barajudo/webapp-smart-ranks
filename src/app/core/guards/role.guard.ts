import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRole = localStorage.getItem('userRole');
    if (!userRole || !requiredRoles.includes(userRole)) {
      this.router.navigate(['/invoices']);
      return false;
    }
    return true;
  }
}