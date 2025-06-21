import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importe withInterceptors
import { CoreModule }      from './core/core-module';
import { authInterceptor } from './core/interceptors/auth-interceptor'; // Importe o interceptor
import { routes } from './app.routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Adicione o interceptor aqui
    importProvidersFrom(CoreModule, NgbModule) // Adicione o CoreModule aqui
  ]
};
