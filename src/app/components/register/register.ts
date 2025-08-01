import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { RegisterRequest } from '../../interfaces/register-request';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    RouterLink,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  authService = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);

  hidePassword = true;
  hideConfirmPassword = true;
  form!: FormGroup;
  availableRoles: string[] = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      roles: [[]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });

    this.loadRoles();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword && confirmPassword.hasError('passwordMismatch') && password!.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  loadRoles(): void {
    this.authService.getRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.matSnackBar.open('Failed to load roles. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.matSnackBar.open('Please correct the form errors.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    const registerRequest: RegisterRequest = {
      email: this.form.value.email,
      fullName: this.form.value.fullName,
      roles: this.form.value.roles,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        let errorMessage = 'An unexpected error occurred.';
        if (error.error && typeof error.error === 'object') {
          if (Array.isArray(error.error) && error.error.length > 0 && error.error[0].description) {
            errorMessage = error.error.map((err: any) => err.description).join('\n');
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else {
            const errors = Object.values(error.error).flat();
            if (errors.length > 0) {
              errorMessage = errors.join('\n');
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.matSnackBar.open(errorMessage, 'Close', {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      },
    });
  }
}