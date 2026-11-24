import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { civicGrantPreset } from './civicgrant-preset';
import { RuntimeConfig } from './runtime-config';

export function appConfig(config: RuntimeConfig): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes, withComponentInputBinding()),
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
