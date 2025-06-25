// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; // Importe inject para obter serviços
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

// Interceptor funcional
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService); // Injete o serviço usando inject()
  const router = inject(Router); // Injete o Router

  console.log('AuthInterceptor: Interceptando requisição para', req.url);

  let authReq = req;
  const token = authService.getToken();
  const selectedCondominioId = authService.getSelectedCondominioId();

  // Adiciona o token JWT
  if (token) {
    console.log('AuthInterceptor: Token encontrado. Adicionando Authorization header.');
    authReq = authReq.clone({
      headers: authReq.headers.set('Authorization', `Bearer ${token}`)
    });
  } else {
    console.warn('AuthInterceptor: Token NÃO encontrado para a requisição de', req.url);
  }

  // Adiciona o ID do Condomínio (se existir)
  if (selectedCondominioId) {
    console.log('AuthInterceptor: Condomínio ID encontrado. Adicionando X-Condominio-ID header.');
    authReq = authReq.clone({
      headers: authReq.headers.set('X-Condominio-ID', selectedCondominioId)
    });
  } else {
    console.warn('AuthInterceptor: Condomínio ID NÃO encontrado para a requisição de', req.url);
  }

  // Envia a requisição e lida com erros
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('AuthInterceptor: Erro 401/403 detectado, fazendo logout.', error);
        authService.logout(); // Isso já redireciona para o login
      }
      return throwError(() => error);
    })
  );
};
