// src/app/features/admin/services/admin-users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Importe o ambiente

// Interface para o tipo de usuário (baseado no seu enum TipoUsuario do backend)
export enum UserType {
  SINDICO = 'SINDICO',
  ADMINISTRADOR = 'ADMINISTRADOR',
  MORADOR = 'MORADOR',
  FUNCIONARIO = 'FUNCIONARIO'
}

// Interface para o modelo de usuário que vem do backend
export interface User {
  id: string; // UUID
  nome: string;
  email: string;
  tipoUsuario: UserType;
  ativo: boolean;
  cpf?: string; // Opcional
  telefone?: string; // Opcional
  dataCriacao: string; // LocalDateTime como string
  dataAtualizacao: string; // LocalDateTime como string
}

// Interface para a requisição de criação de usuário
export interface CreateUserRequest {
  nome: string;
  email: string;
  senha?: string; // Senha é opcional para atualização, mas necessária para criação
  tipoUsuario: UserType;
  cpf?: string;
  telefone?: string;
}

// Interface para a requisição de atualização de usuário
export interface UpdateUserRequest {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  cpf?: string;
  telefone?: string;
  // Não incluímos senha na atualização direta aqui, pois seria um endpoint separado para mudança de senha
}


@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Lista todos os usuários cadastrados no sistema.
   * @returns Um Observable com a lista de usuários.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/usuarios/listar`);
  }

  /**
   * Busca um usuário pelo seu ID.
   * @param id O ID do usuário (UUID).
   * @returns Um Observable com o usuário encontrado.
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/usuarios/${id}`);
  }

  /**
   * Cria um novo usuário (ADMINISTRADOR, SINDICO, MORADOR, FUNCIONARIO).
   * Note que o backend pode ter endpoints específicos para criar cada tipo.
   * Este assume um endpoint geral ou para ADMINISTRAÇÃO.
   * @param userRequest Os dados do novo usuário.
   * @returns Um Observable com o usuário criado.
   */
  createUser(userRequest: CreateUserRequest): Observable<User> {
    // No seu backend, o endpoint para criar um administrador era /admin/usuarios/criar-admin
    // Vamos generalizar para /admin/usuarios/criar ou manter específico se houver separação por tipo.
    // Para simplificar, vou usar um endpoint '/admin/usuarios' e deixar o backend rotear pelo tipo.
    // Se o backend espera um endpoint específico para cada tipo, ajuste aqui.
    return this.http.post<User>(`${this.apiUrl}/admin/usuarios/criar`, userRequest);
  }

  /**
   * Atualiza um usuário existente.
   * @param userId O ID do usuário a ser atualizado.
   * @param userRequest Os dados do usuário atualizados.
   * @returns Um Observable com o usuário atualizado.
   */
  updateUser(userId: string, userRequest: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/usuarios/${userId}`, userRequest);
  }

  /**
   * Deleta um usuário pelo seu ID.
   * @param id O ID do usuário a ser deletado.
   * @returns Um Observable vazio após a exclusão.
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/usuarios/${id}`);
  }
}
