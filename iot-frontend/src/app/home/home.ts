import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  private router = inject(Router);

  get user() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  get initials(): string {
    return `${this.user.firstName?.[0] ?? ''}${this.user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }
  
  get profilePicture(): string | null {
    return this.user.profilePicture || null;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}