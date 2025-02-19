import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    console.log('AuthGuard.canActivate - isLoggedIn:', this.authService.isLoggedIn());
    
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    return this.router.createUrlTree(['/auth/login']);
  }
}