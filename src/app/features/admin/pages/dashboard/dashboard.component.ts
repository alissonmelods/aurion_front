// src/app/features/admin/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router'; // Importe CommonModule para ngIf, etc.

@Component({
  selector: 'app-dashboard',
  standalone: true, // Certifique-se de que é Standalone
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor() { }
}
