// src/app/features/products/products.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './pages/products-list/products-list.component';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';

@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectButtonModule,
    TagModule,
    ConfirmDialogModule,
    SelectModule
  ]
})
export class ProductsModule { }