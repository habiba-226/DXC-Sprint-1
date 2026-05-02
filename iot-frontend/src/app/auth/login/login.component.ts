import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  showPassword = false;
  isLocked = false; 

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        this.isLocked = false; // reset on success
        this.auth.fetchAndStoreProfile(this.loginForm.value.email!).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/home']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        
        if (err.status === 429) {
          this.isLocked = true; // lock the UI
          this.errorMessage = err.error || 'Account locked! Please wait 5 minutes.';
        } else if (err.status === 401 || err.status === 404) {
          this.isLocked = false;
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.isLocked = false;
          this.errorMessage = 'An internal error occurred. Please try again.';
        }
      }
    });
  }
}

// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   private fb = inject(FormBuilder);
//   private router = inject(Router);

//   loginForm = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', Validators.required]
//   });

//   isLoading = false;
//   errorMessage = '';
//   showPassword = false;

//   get email() { return this.loginForm.get('email')!; }
//   get password() { return this.loginForm.get('password')!; }

//   onSubmit(): void {
//     if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }

//     // TEMP: fake login for testing, remove when backend is ready
//     localStorage.setItem('token', 'fake-token');
//     localStorage.setItem('user', JSON.stringify({
//       firstName: 'Habiba',
//       lastName: 'Test',
//       email: this.loginForm.value.email,
//       userId: 1,
//       token: 'fake-token'
//     }));
//     this.router.navigate(['/home']);
//   }
// }