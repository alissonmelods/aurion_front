// src/app/features/admin/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para ngIf, etc.

@Component({
  selector: 'app-dashboard',
  standalone: true, // Certifique-se de que é Standalone
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor() { }
}
