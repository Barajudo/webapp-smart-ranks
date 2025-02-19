import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesListComponent } from './pages/invoices-list/invoices-list.component';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

const routes: Routes = [
  {
    path: '',
    component: InvoicesListComponent
  }
];

@NgModule({
  declarations: [
    InvoicesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule
  ]
})
export class InvoicesModule { }