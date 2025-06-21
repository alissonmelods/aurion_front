import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component'; // Importe o layout
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importe o componente Dashboard
// Importe outros componentes de gerenciamento conforme forem criados
// import { UserManagementComponent } from './components/user-management/user-management.component';
// import { CondoManagementComponent } from './components/condo-management/condo-management.component';
// import { UserCondoAssociationComponent } from './components/user-condo-association/user-condo-association.component';

const routes: Routes = [
  {
    path: '', // Rota vazia significa que este é o "root" do AdminModule (ex: /admin)
    component: AdminLayoutComponent, // Este componente define o layout principal
    children: [ // As rotas filhas serão renderizadas DENTRO do <router-outlet> do AdminLayoutComponent
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona /admin para /admin/dashboard
      { path: 'dashboard', component: DashboardComponent },
      // { path: 'usuarios', component: UserManagementComponent }, // Rota para gerenciar usuários
      // { path: 'condominios', component: CondoManagementComponent }, // Rota para gerenciar condomínios
      // { path: 'associacoes', component: UserCondoAssociationComponent }, // Rota para associações
      // Adicione mais rotas filhas aqui para outras funcionalidades do admin
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutComponent // Importe o AdminLayoutComponent aqui pois ele é Standalone e usado na rota
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
