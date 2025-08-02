import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { ForgotPasswordRequest } from '../interfaces/forgot-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/login`, data)
      .pipe(
        map((response: AuthResponse) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  getUserDetail = (): any => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  };

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout = (): void => {
    localStorage.removeItem(this.tokenKey);
  };

  private getToken = (): string | null =>
    localStorage.getItem(this.tokenKey) || '';

  register(data: RegisterRequest): Observable<AuthResponse> {
    const registerPayload = {
      email: data.email,
      fullname: data.fullName,
      roles: data.roles,
      password: data.password
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/register`, registerPayload);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<any[]>(`${this.apiUrl}Roles`).pipe(
      map((roles: any[]) => roles.map((role: any) => role.name))
    );
  }

  resetPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    const resetPayload = {
      email: data.email,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/forgot-password`, resetPayload);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Account/${id}`).pipe(
      catchError((error: any) => {
        if (error.status === 404) {
          return this.http.get<any>(`${this.apiUrl}Account/details/${id}`).pipe(
            catchError((innerError: any) => {
              const userDetail = this.getUserDetail();
              if (userDetail && userDetail.id === id) {
                return of(userDetail);
              }
              throw innerError;
            })
          );
        }
        throw error;
      })
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/change-password`, data);
  }
}
