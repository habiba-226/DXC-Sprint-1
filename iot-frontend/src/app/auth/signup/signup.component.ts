import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/)
    ]],
    confirmPassword: ['', Validators.required],
    profilePicture: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  previewUrl: string | null = null;

  get firstName() { return this.signupForm.get('firstName')!; }
  get lastName()  { return this.signupForm.get('lastName')!; }
  get email()     { return this.signupForm.get('email')!; }
  get password()  { return this.signupForm.get('password')!; }
  get confirmPassword() { return this.signupForm.get('confirmPassword')!; }
  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.previewUrl = base64;
      this.signupForm.patchValue({ profilePicture: base64 });
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(event: Event): void {
    event.stopPropagation(); // Prevents the file browser from opening
    event.preventDefault();  
    
    this.previewUrl = null;
    this.signupForm.patchValue({ profilePicture: '' });
    
    const fileInput = document.getElementById('avatar-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid) { 
      this.signupForm.markAllAsTouched(); 
      return; 
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.signupForm.value;

    // 1. Create the account
    this.auth.signup(this.signupForm.value as any).subscribe({
      next: () => {
        this.successMessage = 'Account created! Logging you in...';

        // 2. Immediately call Login with the same credentials
        this.auth.login({ email: email!, password: password! }).subscribe({
          next: () => {
            // 3. Fetch the profile data so the Home page has the initials/photo
            this.auth.fetchAndStoreProfile(email!).subscribe({
              next: () => {
                this.isLoading = false;
                // 4. Redirect to Home and clear history so they can't go "Back" to Signup
                this.router.navigate(['/home'], { replaceUrl: true });
              }
            });
          },
          error: () => {
            this.isLoading = false;
            this.errorMessage = 'Account created, but auto-login failed. Please sign in manually.';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'An account with this email already exists.';
        } else {
          this.errorMessage = 'Internal error occurred. Please try again.';
        }
      }
    });
  }
}
