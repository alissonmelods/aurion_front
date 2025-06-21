// src/app/features/admin/components/user-management/user-management.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf, ngFor
import {AdminUsersService, User, UserType} from '../../services/admin-users.service'; // Importe o serviço e a interface User
import { RouterModule } from '@angular/router'; // Para routerLink e navegação
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Importar NgbModal e NgbModule
import { UserFormComponent } from '../user-form/user-form.component'; // Importe o UserFormComponent

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Para usar routerLink no HTML
    NgbModule // Necessário para NgbModal
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Opcional, mas comum para otimização
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private adminUsersService: AdminUsersService,
    private cdRef: ChangeDetectorRef, // Para ChangeDetectionStrategy.OnPush
    private modalService: NgbModal // Injete o NgbModal
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carrega a lista de usuários do backend.
   */
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.adminUsersService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.isLoading = false;
        this.cdRef.markForCheck(); // Atualiza a view
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar usuários: ' + (err.error?.message || err.message || 'Erro desconhecido.');
        this.isLoading = false;
        console.error('Erro ao carregar usuários:', err);
        this.cdRef.markForCheck(); // Atualiza a view
      }
    });
  }

  /**
   * Abre o modal para criar um novo usuário.
   */
  openCreateUserModal(): void {
    const modalRef = this.modalService.open(UserFormComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.isEditing = false; // Indica que é para criação

    // Escuta o evento de sucesso do formulário para recarregar a lista
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.loadUsers(); // Recarrega a lista após a criação/edição
      }
    }, (reason) => {
      // Modal fechado sem sucesso (cancelado ou clicou fora)
      console.log('Modal de usuário fechado:', reason);
    });
  }

  /**
   * Abre o modal para editar um usuário existente.
   * @param user O usuário a ser editado.
   */
  openEditUserModal(user: User): void {
    const modalRef = this.modalService.open(UserFormComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.isEditing = true; // Indica que é para edição
    modalRef.componentInstance.userId = user.id; // Passa o ID do usuário para o formulário
    modalRef.componentInstance.initialUserData = user; // Passa os dados iniciais do usuário

    modalRef.result.then((result) => {
      if (result === 'success') {
        this.loadUsers(); // Recarrega a lista após a edição
      }
    }, (reason) => {
      console.log('Modal de edição de usuário fechado:', reason);
    });
  }

  /**
   * Lida com a exclusão de um usuário.
   * @param user O usuário a ser deletado.
   */
  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja deletar o usuário ${user.nome} (${user.email})?`)) {
      this.isLoading = true;
      this.errorMessage = null;
      this.adminUsersService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id); // Remove da lista local
          this.isLoading = false;
          this.cdRef.markForCheck(); // Atualiza a view
          alert('Usuário deletado com sucesso!'); // Feedback visual
        },
        error: (err) => {
          this.errorMessage = 'Erro ao deletar usuário: ' + (err.error?.message || err.message || 'Erro desconhecido.');
          this.isLoading = false;
          console.error('Erro ao deletar usuário:', err);
          this.cdRef.markForCheck(); // Atualiza a view
        }
      });
    }
  }

  /**
   * Função para formatar o status 'ativo'/'inativo'.
   */
  formatActiveStatus(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }

  /**
   * Função para formatar o tipo de usuário.
   */
  formatUserType(type: UserType): string {
    switch (type) {
      case UserType.ADMINISTRADOR: return 'Administrador';
      case UserType.SINDICO: return 'Síndico';
      case UserType.MORADOR: return 'Morador';
      case UserType.FUNCIONARIO: return 'Funcionário';
      default: return type;
    }
  }
}
