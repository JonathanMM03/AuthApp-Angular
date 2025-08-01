import { Component } from '@angular/core';
import { Role as RoleService } from '../../services/role';
import { CommonModule } from '@angular/common';
import { RoleForm } from '../../components/role-form/role-form';
import { CreateRoleDto } from '../../interfaces/create-role';
import { RoleList } from '../../components/role-list/role-list';
import { AssignRole } from "../../components/assign-role/assign-role";

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    RoleForm,
    RoleList,
    AssignRole
],
  templateUrl: './role.html',
  styleUrl: './role.css'
})
export class Role {
  newRole: CreateRoleDto = { roleName: '' };
  errorMessage = '';

  constructor(private roleService: RoleService) {}

  createRole(role: CreateRoleDto) {
    this.roleService.createRole(role).subscribe({
      next: () => {
        this.errorMessage = '';
        this.newRole.roleName = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create role.';
      }
    });
  }
}