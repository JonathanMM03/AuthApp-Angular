import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { CreateRoleDto } from '../../interfaces/create-role';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './role-form.html',
  styleUrls: ['./role-form.css']
})
export class RoleForm {
  @Input({ required: true }) role!: CreateRoleDto;
  @Input() message = '';
  @Output() addRole = new EventEmitter<CreateRoleDto>();

  add() {
    if (this.role.roleName?.trim()) {
      this.addRole.emit(this.role);
    }
  }
}