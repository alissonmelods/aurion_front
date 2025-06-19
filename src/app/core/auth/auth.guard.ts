// src/app/core/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importe o AuthService
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Provê o guarda em nível de aplicação (singleton)
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verifica o status de autenticação do serviço
    if (this.authService.isAuthenticated()) {
      return true; // Usuário autenticado, permite acesso à rota
    } else {
      // Usuário não autenticado, redireciona para a página de login
      return this.router.createUrlTree(['/login']);
    }
  }
}
