import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Role as RoleService } from '../../services/role';
import { RoleResponseDto } from '../../interfaces/role-response';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './role-list.html',
  styleUrls: ['./role-list.css']
})
export class RoleList implements OnInit, OnDestroy {
  roles: RoleResponseDto[] = [];
  errorMessage = '';
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);

  private reloadInterval: any;

  ngOnInit(): void {
    this.loadRoles();

    this.reloadInterval = setInterval(() => {
      this.roleService.getRoles().subscribe({
        next: (data) => {
          if (JSON.stringify(this.roles) !== JSON.stringify(data)) {
            this.roles = data;
          }
        },
        error: () => {}
      });
    }, 2500);
  }

  ngOnDestroy(): void {
    clearInterval(this.reloadInterval);
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.snackBar.open('Roles loaded successfully.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to fetch roles.';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  deleteRole(id: string) {
    if (window.confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.snackBar.open('Role deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.loadRoles();
        },
        error: (err) => {
          const msg = err.error?.message || 'Delete failed.';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }
}