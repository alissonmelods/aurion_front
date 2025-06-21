// src/app/features/admin/components/user-form/user-form.component.ts
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // Para controlar o modal
import { AdminUsersService, User, CreateUserRequest, UpdateUserRequest, UserType } from '../../services/admin-users.service'; // Importe o serviço e interfaces
import { Observable, of } from 'rxjs'; // Importe Observable e of

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Para ngModel
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  @Input() isEditing = false; // Indica se o formulário é para edição
  @Input() userId: string | null = null; // ID do usuário para edição
  @Input() initialUserData: User | null = null; // Dados iniciais para preencher o formulário (em caso de edição)

  // Dados do formulário
  user: Partial<CreateUserRequest & UpdateUserRequest> = {
    nome: '',
    email: '',
    senha: '', // Senha é para criação
    tipoUsuario: UserType.MORADOR, // Valor padrão
    ativo: true, // Padrão para novo usuário
    cpf: '',
    telefone: ''
  };

  userTypes = Object.values(UserType); // Para o select de tipos de usuário
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal, // Para fechar o modal
    private adminUsersService: AdminUsersService,
    private cdRef: ChangeDetectorRef // Para forçar a detecção de mudanças
  ) { }

  ngOnInit(): void {
    if (this.isEditing && this.userId) {
      this.isLoading = true;
      // Se estiver editando e os dados iniciais já vieram do input, use-os
      if (this.initialUserData) {
        this.user = { ...this.initialUserData }; // Copia os dados para o formulário
        this.isLoading = false;
        this.cdRef.markForCheck();
      } else {
        // Caso contrário, busque os dados do usuário pelo ID
        this.adminUsersService.getUserById(this.userId).subscribe({
          next: (data: User) => {
            this.user = { ...data }; // Preenche o formulário com os dados
            this.isLoading = false;
            this.cdRef.markForCheck();
          },
          error: (err) => {
            this.errorMessage = 'Erro ao carregar dados do usuário: ' + (err.error?.message || err.message || 'Erro desconhecido.');
            this.isLoading = false;
            console.error('Erro ao carregar usuário para edição:', err);
            this.cdRef.markForCheck();
          }
        });
      }
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.isLoading = true;

    let operation$: Observable<User>;

    if (this.isEditing && this.user.id) {
      // Lógica para edição: envia apenas os campos que podem ser atualizados
      const updatePayload: UpdateUserRequest = {
        id: this.user.id,
        nome: this.user.nome!,
        email: this.user.email!,
        ativo: this.user.ativo!,
        cpf: this.user.cpf,
        telefone: this.user.telefone
      };
      operation$ = this.adminUsersService.updateUser(this.user.id, updatePayload);
    } else {
      // Lógica para criação: garante que todos os campos obrigatórios estejam presentes
      if (!this.user.nome || !this.user.email || !this.user.senha || !this.user.tipoUsuario) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios (nome, email, senha, tipo de usuário).';
        this.isLoading = false;
        this.cdRef.markForCheck();
        return;
      }
      const createPayload: CreateUserRequest = {
        nome: this.user.nome,
        email: this.user.email,
        senha: this.user.senha, // Senha só é enviada na criação
        tipoUsuario: this.user.tipoUsuario,
        cpf: this.user.cpf,
        telefone: this.user.telefone
      };
      operation$ = this.adminUsersService.createUser(createPayload);
    }

    operation$.subscribe({
      next: (response) => {
        alert(`${this.isEditing ? 'Usuário atualizado' : 'Usuário criado'} com sucesso!`);
        this.activeModal.close('success'); // Fecha o modal com sucesso
      },
      error: (err) => {
        this.errorMessage = 'Erro ao salvar usuário: ' + (err.error?.message || err.message || 'Erro desconhecido.');
        this.isLoading = false;
        console.error('Erro ao salvar usuário:', err);
        this.cdRef.markForCheck(); // Força a detecção para mostrar o erro
      }
    });
  }

  closeModal(): void {
    this.activeModal.dismiss('cancel'); // Fecha o modal sem sucesso
  }
}
