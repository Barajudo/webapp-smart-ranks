// src/app/app-routing.module.ts
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

@Component({
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Smart Ranks</h2>
        <p class="text-lg text-gray-600">Select an option from the menu to get started</p>
      </div>
    </div>
  `
})
export class DashboardComponent {}

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'user'] }
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'user'] }
      },
      {
        path: 'invoices',
        loadChildren: () => import('./features/invoices/invoices.module').then(m => m.InvoicesModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'user'] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }