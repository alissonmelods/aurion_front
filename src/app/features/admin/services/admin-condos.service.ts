// src/app/features/admin/services/admin-condos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Importe o ambiente

// Interface para o tipo de condomínio (baseado na sua entidade Condominio do backend)
export interface Condominio {
  id: string; // UUID
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cnpj?: string; // Opcional
  sindicoId?: string; // UUID do síndico associado, opcional
  nomeBancoDados?: string; // Adicionado para exibir o nome do BD (pode ser útil para debug/info)
  usuarioBancoDados?: string; // Adicionado para exibir o usuário do BD (pode ser útil para debug/info)
  dataCriacao: string; // LocalDateTime como string
  dataAtualizacao: string; // LocalDateTime como string
}

// Interface para a requisição de criação de condomínio
export interface CreateCondominioRequest {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cnpj?: string;
  // Não incluímos sindicoId na criação, pois a associação será em outro endpoint/modal
  // Nem dados de banco de dados, pois o backend irá gerá-los
}

// Interface para a requisição de atualização de condomínio
export interface UpdateCondominioRequest {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cnpj?: string;
  sindicoId?: string; // Pode ser atualizado se o síndico mudar
}

@Injectable({
  providedIn: 'root'
})
export class AdminCondosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Lista todos os condomínios cadastrados no sistema.
   * @returns Um Observable com a lista de condomínios.
   */
  getAllCondominios(): Observable<Condominio[]> {
    return this.http.get<Condominio[]>(`${this.apiUrl}/admin/condominios`);
  }

  /**
   * Busca um condomínio pelo seu ID.
   * @param id O ID do condomínio (UUID).
   * @returns Um Observable com o condomínio encontrado.
   */
  getCondominioById(id: string): Observable<Condominio> {
    return this.http.get<Condominio>(`${this.apiUrl}/admin/condominios/${id}`);
  }

  /**
   * Cria um novo condomínio.
   * Este endpoint no backend deverá disparar a criação do banco de dados específico do condomínio.
   * @param condominioRequest Os dados do novo condomínio.
   * @returns Um Observable com o condomínio criado.
   */
  createCondominio(condominioRequest: CreateCondominioRequest): Observable<Condominio> {
    return this.http.post<Condominio>(`${this.apiUrl}/admin/condominios`, condominioRequest);
  }

  /**
   * Atualiza um condomínio existente.
   * @param condominioId O ID do condomínio a ser atualizado.
   * @param condominioRequest Os dados do condomínio atualizados.
   * @returns Um Observable com o condomínio atualizado.
   */
  updateCondominio(condominioId: string, condominioRequest: UpdateCondominioRequest): Observable<Condominio> {
    return this.http.put<Condominio>(`${this.apiUrl}/admin/condominios/${condominioId}`, condominioRequest);
  }

  /**
   * Deleta um condomínio pelo seu ID.
   * CUIDADO: No backend, isso deve implicar em apagar o banco de dados do condomínio!
   * @param id O ID do condomínio a ser deletado.
   * @returns Um Observable vazio após a exclusão.
   */
  deleteCondominio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/condominios/${id}`);
  }
}
