import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { User } from '../../services/user';
import { Role } from '../../services/role';
import { RoleAssignDto } from '../../interfaces/role-assign';
import { User as UserModel } from '../../interfaces/user';
import { RoleResponseDto } from '../../interfaces/role-response';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './assign-role.html',
  styleUrls: ['./assign-role.css']
})
export class AssignRole implements OnInit {
  users: UserModel[] = [];
  roles: RoleResponseDto[] = [];

  selectedUserId: string = '';
  selectedRoleId: string = '';

  private userService = inject(User);
  private roleService = inject(Role);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadUsersAndRoles();
  }

  loadUsersAndRoles() {
    this.userService.getAllUsers().subscribe(users => this.users = users);
    this.roleService.getRoles().subscribe(roles => this.roles = roles);
  }

  assignRole() {
    if (!this.selectedUserId || !this.selectedRoleId) return;

    const dto: RoleAssignDto = {
      userId: this.selectedUserId,
      roleId: this.selectedRoleId
    };

    this.roleService.assignRole(dto).subscribe({
      next: () => {
        this.snackBar.open('Rol asignado correctamente.', 'Cerrar', { duration: 3000 });
        this.selectedUserId = '';
        this.selectedRoleId = '';
        this.loadUsersAndRoles();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al asignar el rol.';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }
}