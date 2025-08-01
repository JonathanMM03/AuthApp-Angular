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
import { CommonModule } from '@angular/common';
import { ForgotPasswordRequest } from '../../interfaces/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatInputModule,
    RouterLink,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  authService = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);

  hideNewPassword = true;
  hideConfirmNewPassword = true;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmNewPassword = control.get('confirmNewPassword');

    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      confirmNewPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmNewPassword && confirmNewPassword.hasError('passwordMismatch') && newPassword!.value === confirmNewPassword.value) {
      confirmNewPassword.setErrors(null);
    }
    return null;
  }

  resetPassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.matSnackBar.open('Please correct the form errors.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    const resetRequest: ForgotPasswordRequest = {
      email: this.form.value.email,
      newPassword: this.form.value.newPassword,
      confirmNewPassword: this.form.value.confirmNewPassword,
    };

    this.authService.resetPassword(resetRequest).subscribe({
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