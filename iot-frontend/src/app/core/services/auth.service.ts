import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string; 
  profilePicture?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  profilePicture?: string;
}

export interface UpdateProfilePayload {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  profilePicture?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:8080/api';

  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/signup`, payload, { responseType: 'text' }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, payload, { responseType: 'text' }).pipe(
      tap(() => {
        // Backend only returns "Login successful" string, so we store email to fetch profile
        localStorage.setItem('pendingEmail', payload.email);
      }),
      catchError(err => throwError(() => err))
    );
  }

  fetchAndStoreProfile(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/auth/profile?email=${email}`).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'logged-in'); // no real token from this backend
      }),
      catchError(err => throwError(() => err))
    );
  }

  getProfile(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/auth/profile?email=${email}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateProfile(payload: UpdateProfilePayload): Observable<any> {
    return this.http.put(`${this.API_URL}/auth/profile`, payload, { responseType: 'text' }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingEmail');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): UserProfile | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}