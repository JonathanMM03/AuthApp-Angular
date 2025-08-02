import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { User as UserModel } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class User {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<any[]>(`${this.apiUrl}Account/all`).pipe(
      catchError((error: any) => {
        if (error.status === 404) {
          return this.http.get<any[]>(`${this.apiUrl}Account/users`);
        }
        throw error;
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          return this.http.get<any[]>(`${this.apiUrl}Account`);
        }
        throw error;
      }),
      map((response: any) => {
        const users = Array.isArray(response) ? response : 
                     (response.users ? response.users : 
                     (response.data ? response.data : []));
        
        return users.map((user: any) => ({
          id: user.id || '',
          fullName: user.fullName || user.fullname || user.name || '',
          email: user.email || '',
          roles: Array.isArray(user.roles) ? user.roles : 
                (typeof user.roles === 'string' ? [user.roles] : [])
        }));
      })
    );
  }
}
