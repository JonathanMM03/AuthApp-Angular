import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { CreateRoleDto } from '../interfaces/create-role';
import { RoleResponseDto } from '../interfaces/role-response';
import { RoleAssignDto } from '../interfaces/role-assign';

@Injectable({
  providedIn: 'root'
})
export class Role {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createRole(data: CreateRoleDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Roles`, data);
  }

  getRoles(): Observable<RoleResponseDto[]> {
    return this.http.get<RoleResponseDto[]>(`${this.apiUrl}Roles`);
  }

  deleteRole(id: string): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}Roles/${id}`);
  }

  assignRole(data: RoleAssignDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Roles/assign`, data);
  }
}