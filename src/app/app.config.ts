// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importe o interceptor funcional (o arquivo que você acabou de ajustar)
import { authInterceptor } from './core/interceptors/auth.interceptor'; // <-- Caminho e nome corretos da função

// Importe o CoreModule (se ele contiver outros serviços que precisam ser singletons)
import { CoreModule } from './core/core.module'; // <-- Mantenha esta linha se CoreModule tem outros provedores

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // Provisão do HttpClient com o interceptor funcional:
    provideHttpClient(withInterceptors([authInterceptor])), // <-- Use a função 'authInterceptor' aqui
    importProvidersFrom(CoreModule, NgbModule) // <-- Mantenha importProvidersFrom para outros serviços do CoreModule e NgbModule
  ]
};
