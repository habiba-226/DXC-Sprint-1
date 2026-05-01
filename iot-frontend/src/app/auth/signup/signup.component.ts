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
    password: ['', [Validators.required, Validators.minLength(6)]],
    profilePicture: ['']
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  previewUrl: string | null = null;

  get firstName() { return this.signupForm.get('firstName')!; }
  get lastName()  { return this.signupForm.get('lastName')!; }
  get email()     { return this.signupForm.get('email')!; }
  get password()  { return this.signupForm.get('password')!; }

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

  onSubmit(): void {
    if (this.signupForm.invalid) { this.signupForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.signup(this.signupForm.value as any).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) this.errorMessage = 'An account with this email already exists.';
        else this.errorMessage = 'Internal error occurred. Please try again.';
      }
    });
  }
}
