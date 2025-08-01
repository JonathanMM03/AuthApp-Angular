import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangePasswordDialog } from '../../components/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule, MatButtonModule, RouterLink, MatDialogModule, MatTooltipModule],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css'
})
export class AccountDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  accountDetail$!: Observable<any>;

  ngOnInit(): void {
    this.accountDetail$ = this.route.params.pipe(
      switchMap(params => {
        const userId = params['id'];
        return this.authService.getUserById(userId).pipe(
          catchError(error => {
            const currentUser = this.authService.getUserDetail();
            if (currentUser && currentUser.id === userId) {
              return of(currentUser);
            } else {
              this.snackBar.open('Error loading user details: ' + (error.error?.message || 'Unknown error'), 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
              });
              return of(null);
            }
          })
        );
      })
    );
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Password was successfully changed
        this.snackBar.open('Password changed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
      }
    });
  }

  isOwnProfile(user: any): boolean {
    const currentUser = this.authService.getUserDetail();
    return currentUser && user && currentUser.id === user.id;
  }
}