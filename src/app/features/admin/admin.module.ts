import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importe DashboardComponent

@NgModule({
  declarations: [], // Não precisamos de declarações se todos os componentes são Standalone
  imports: [
    CommonModule,
    AdminRoutingModule,
    // DashboardComponent, // Se DashboardComponent fosse Standalone e usado em outro componente deste módulo, seria importado aqui
  ]
})
export class AdminModule { }
