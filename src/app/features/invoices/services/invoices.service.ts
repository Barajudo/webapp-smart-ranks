import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Invoice, CreateInvoiceDto } from '../interfaces/invoice.interface';
import { ProductsService } from '../../products/services/products.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createInvoice(data: CreateInvoiceDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, data)
      .pipe(
        tap(response => console.log('Invoice creation response:', response)),
        catchError(error => {
          console.error('Error creating invoice:', error);
          console.error('Error details:', error.error);
          return this.handleError(error);
        })
      );
  }

  getMonthlyPurchases(userId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/monthly-purchases`)
      .pipe(catchError(this.handleError));
  }

  getInvoicesByUser(userId: string): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Server error';
    }
    return throwError(() => new Error(errorMessage));
  }
}