import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { accessTokenInterceptor } from './auth/access-token-interceptor';
import { Session } from './auth/session';
import { civicGrantPreset } from './civicgrant-preset';
import { RuntimeConfig } from './runtime-config';

export function appConfig(config: RuntimeConfig, session: Session): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes, withComponentInputBinding()),
      provideHttpClient(withInterceptors([accessTokenInterceptor])),
      { provide: Session, useValue: session },
      { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
      providePrimeNG({
        license: config.primeUiLicenseKey,
        theme: {
          preset: civicGrantPreset,
          options: {
            darkModeSelector: 'none',
            cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
          },
        },
      }),
    ],
  };
}
