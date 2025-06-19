import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import {LoginFormComponent} from './features/auth-page/components/login-form/login-form.component';

export const routes: Routes = [
  // Rota para a página de login
  {
    path: 'login',
    component: LoginFormComponent // Use o componente diretamente, pois ele é Standalone
  },
  // Rota para o painel administrativo, protegida pelo AuthGuard
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
    canActivate: [authGuard] // Protege esta rota com o AuthGuard
  },
  // Redirecionamento para a página de login por padrão ou para o admin se autenticado
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Rota wildcard para páginas não encontradas
  { path: '**', redirectTo: 'login' } // Você pode criar um componente 404 para isso depois
];
