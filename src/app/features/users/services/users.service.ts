import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

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

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createUser(data: CreateUserDto): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, changes: UpdateUserDto): Observable<User> {
    return this.http
      .patch<User>(`${this.apiUrl}/${id}`, changes)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
