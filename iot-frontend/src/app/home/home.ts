import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="min-height:100vh; background:#0a0c10; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;">
      <div style="position:absolute; top:1.5rem; right:1.5rem;">
        <div (click)="goToProfile()" style="width:42px; height:42px; border-radius:50%; background:#FF6B35; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; font-weight:bold; font-size:1rem;">
          {{ initials }}
        </div>
      </div>
      <h1 style="color:white; font-size:2rem; margin-bottom:0.5rem;">Welcome to IoT Monitor</h1>
      <p style="color:rgba(255,255,255,0.4);">Dashboard coming in Sprint 2</p>
    </div>
  `
})
export class Home {
  private router = inject(Router);

  get initials(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}