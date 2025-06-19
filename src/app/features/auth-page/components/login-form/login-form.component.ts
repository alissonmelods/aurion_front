// src/app/features/auth-page/components/login-form/login-form.component.ts
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar ngIf, ngFor
import { FormsModule } from '@angular/forms'; // Para usar ngModel e forms
import { AuthService } from '../../../../core/auth/auth.service'; // Ajuste o caminho se necessário
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true, // Componente Standalone
  imports: [
    CommonModule,
    FormsModule // Importe FormsModule para trabalhar com formulários de template-driven
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'] // Opcional, se usar SCSS
})
export class LoginFormComponent {
  email = '';
  senha = '';
  errorMessage: string | null = null;
  condominios: { id: string, nome: string }[] | null = null;
  selectedCondominioId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  onLogin(): void {
    this.errorMessage = null; // Limpa mensagens de erro anteriores
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: response => {
        this.condominios = response.condominios;
        if (this.condominios && this.condominios.length > 0) {
          // Se houver condomínios, permite que o usuário selecione um
          // ou redireciona direto se for apenas um (ou admin, que pode ir direto)
          if (this.condominios.length === 1 || this.email === 'seu_admin_email@example.com') { // Exemplo para admin
            this.selectedCondominioId = this.condominios[0].id; // Seleciona o primeiro por padrão
            this.onCondominioSelected(); // Prossegue com a seleção automática
          }
        } else {
          // Caso raro de login sem condomínios, ou se a lógica do backend não retorna para admin
          this.errorMessage = 'Login bem-sucedido, mas nenhum condomínio associado encontrado.';
          console.log("errorMessage", this.errorMessage);
        }
        this.cdRef.detectChanges();
      },
      error: err => {
        this.errorMessage = err.error || 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Erro de login:', err);
        this.cdRef.detectChanges();
      }
    });
  }

  onCondominioSelected(): void {
    if (this.selectedCondominioId) {
      this.authService.setSelectedCondominio(this.selectedCondominioId);
      this.router.navigate(['/admin']); // Redireciona para o painel administrativo
    } else {
      this.errorMessage = 'Por favor, selecione um condomínio.';
    }
  }
}
