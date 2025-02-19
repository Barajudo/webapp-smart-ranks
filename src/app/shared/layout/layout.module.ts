// src/app/shared/layout/layout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';

// PrimeNG
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutModule { }