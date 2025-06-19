// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// Interfaces para os dados de login e resposta do backend
interface LoginRequest {
  email: string;
  senha: string;
}

interface CondominioLoginDTO {
  id: string;
  nome: string;
}

interface AuthResponse {
  accessToken: string;
  condominios: CondominioLoginDTO[];
}

@Injectable({
  providedIn: 'root' // Provê o serviço em nível de aplicação (singleton)
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable para verificar o status de autenticação em toda a aplicação
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Tenta fazer login com as credenciais fornecidas.
   * Em caso de sucesso, armazena o token e o status do usuário.
   * @param credentials Objeto com email e senha.
   * @returns Observable da resposta de autenticação.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken);
        // Armazene os condomínios do usuário para seleção futura
        localStorage.setItem('user_condominios', JSON.stringify(response.condominios));
        this.isAuthenticatedSubject.next(true); // Atualiza o status de autenticação
      })
    );
  }

  /**
   * Realiza o logout do usuário, removendo o token e os dados do usuário do localStorage.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_condominios');
    localStorage.removeItem('selected_condominio_id'); // Limpa também o ID do condomínio selecionado
    this.isAuthenticatedSubject.next(false); // Atualiza o status de autenticação
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

  /**
   * Verifica se existe um token JWT no localStorage.
   * @returns Verdadeiro se o token existe, falso caso contrário.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Verifica se o usuário está autenticado (tem um token).
   * @returns Verdadeiro se o usuário está autenticado, falso caso contrário.
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Carrega os condomínios associados ao usuário do localStorage.
   * @returns Array de CondominioLoginDTO ou null.
   */
  getUserCondominios(): CondominioLoginDTO[] | null {
    const data = localStorage.getItem('user_condominios');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Define o ID do condomínio selecionado pelo usuário.
   * @param id ID do condomínio a ser selecionado.
   */
  setSelectedCondominio(id: string): void {
    localStorage.setItem('selected_condominio_id', id);
  }

  /**
   * Obtém o ID do condomínio selecionado.
   * @returns O ID do condomínio selecionado ou null.
   */
  getSelectedCondominioId(): string | null {
    return localStorage.getItem('selected_condominio_id');
  }

  // --- Métodos Auxiliares ---
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
