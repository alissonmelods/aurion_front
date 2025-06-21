// src/app/layouts/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importe RouterModule para <router-outlet> e routerLink
import { AuthService } from '../../core/auth/auth.service'; // Importe o AuthService

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Necessário para a <router-outlet> e routerLink
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'] // Crie este arquivo SCSS para estilos personalizados
})
export class AdminLayoutComponent {
  isSidebarOpen = true; // Estado para controlar a abertura/fechamento da sidebar

  constructor(private authService: AuthService) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
