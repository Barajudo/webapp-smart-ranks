import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

// Componente temporal
import { Component } from '@angular/core';

@Component({
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Smart Ranks</h2>
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
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./features/invoices/invoices.module').then(m => m.InvoicesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
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