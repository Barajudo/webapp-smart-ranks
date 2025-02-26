import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Server error';
    }
    return throwError(() => new Error(errorMessage));
  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, updates: UpdateProductDto): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<Product>(url, updates).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          return throwError(() => new Error('Client-side error occurred'));
        } else {
          return throwError(
            () =>
              new Error(error.error?.message || 'Server-side error occurred')
          );
        }
      })
    );
  }

  softDeleteProduct(id: string): Observable<Product> {
    const updates: UpdateProductDto = { status: 'inactive' };
    return this.updateProduct(id, updates);
  }

  deleteProduct(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<boolean>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(
          () => new Error(error.error?.message || 'Error deleting product')
        );
      })
    );
  }
}
