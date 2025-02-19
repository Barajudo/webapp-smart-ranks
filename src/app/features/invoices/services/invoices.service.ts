import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Invoice, CreateInvoiceDto } from '../interfaces/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

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
      .pipe(catchError(this.handleError));
  }

  getMonthlyPurchases(userId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/monthly-purchases`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error('Client-side error occurred'));
    } else {
      return throwError(() => new Error(error.error?.message || 'Server-side error occurred'));
    }
  }
}