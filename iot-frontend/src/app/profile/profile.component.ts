import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UserProfile } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  user: UserProfile | null = null;
  isLoading = true;
  errorMessage = '';

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/)
    ]]
  });
  showPasswordForm = false;
  isPasswordLoading = false;
  passwordError = '';
  passwordSuccess = '';
  showNewPassword = false;
  showCurrentPassword = false;

  newAvatarPreview: string | null = null;
  isAvatarLoading = false;
  avatarSuccess = '';
  avatarError = '';

  ngOnInit(): void {
    // Load from localStorage first for instant display
    this.user = this.auth.getCurrentUser();
    this.isLoading = false;

    // Then refresh from backend if we have email
    if (this.user?.email) {
      this.auth.getProfile(this.user.email).subscribe({
        next: (data) => { this.user = data; localStorage.setItem('user', JSON.stringify(data)); },
        error: () => {} // silently fail, use cached version
      });
    }
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.user) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.newAvatarPreview = base64;
      this.isAvatarLoading = true;
      this.auth.updateProfile({
        email: this.user!.email,
        profilePicture: base64
      }).subscribe({
        next: () => {
          this.isAvatarLoading = false;
          this.avatarSuccess = 'Profile picture updated!';
          if (this.user) this.user.profilePicture = base64;
          setTimeout(() => (this.avatarSuccess = ''), 3000);
        },
        error: (err: any) => {
          this.isAvatarLoading = false;
          // If the backend sent a specific message string, show it.
          // Otherwise, fallback to a generic error message.
          if (err.status === 401 || err.status === 400) {
            this.avatarError = err.error || 'Invalid request.';
          } else {
            this.avatarError = 'An internal error occurred. Please try again.';
          }
        }
      });
    };
    reader.readAsDataURL(file);
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid || !this.user) { this.passwordForm.markAllAsTouched(); return; }
    this.isPasswordLoading = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    this.auth.updateProfile({
      email: this.user.email,
      password: this.passwordForm.value.newPassword as string,
      confirmPassword: this.passwordForm.value.currentPassword as string
    }).subscribe({
      next: () => {
        this.isPasswordLoading = false;
        this.passwordSuccess = 'Password updated successfully!';
        this.passwordForm.reset();
        this.showPasswordForm = false;
        setTimeout(() => (this.passwordSuccess = ''), 4000);
      },
      error: (err: any) => {
        this.isPasswordLoading = false;
        
        // If the backend sent a specific message string, show it. 
        // Otherwise, fallback to a generic error message.
        if (err.status === 401 || err.status === 400) {
          this.passwordError = err.error || 'Invalid request.';
        } else {
          this.passwordError = 'An internal error occurred. Please try again.';
        }
      }
    });
  }

  get initials(): string {
    if (!this.user) return '?';
    return `${this.user.firstName?.[0] ?? ''}${this.user.lastName?.[0] ?? ''}`.toUpperCase();
  }

  logout(): void { this.auth.logout(); }
}