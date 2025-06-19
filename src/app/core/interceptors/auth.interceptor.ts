// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; // Importe o AuthService
import { Router } from '@angular/router'; // Importe o Router

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.authService.getToken();
    const selectedCondominioId = this.authService.getSelectedCondominioId(); // Obtém o ID do condomínio selecionado

    // Se houver um token, clona a requisição e adiciona o cabeçalho Authorization
    if (token) {
      authReq = authReq.clone({
        headers: authReq.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    // Se houver um ID de condomínio selecionado, adiciona o cabeçalho X-Condominio-ID
    if (selectedCondominioId) {
      authReq = authReq.clone({
        headers: authReq.headers.set('X-Condominio-ID', selectedCondominioId)
      });
    }

    // Envia a requisição e lida com erros
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se o erro for 401 Unauthorized ou 403 Forbidden, realiza o logout
        if (error.status === 401 || error.status === 403) {
          this.authService.logout(); // Redireciona para o login e limpa o estado
          // Adicione uma mensagem de erro visual para o usuário, se desejar (ex: um toast)
          // alert('Sessão expirada ou acesso negado. Por favor, faça login novamente.');
        }
        return throwError(() => error); // Propaga o erro para o próximo handler
      })
    );
  }
}
