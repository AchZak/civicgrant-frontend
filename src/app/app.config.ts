import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { accessTokenInterceptor } from './auth/access-token-interceptor';
import { CurrentUser } from './auth/current-user';
import { Session } from './auth/session';
import { civicGrantPreset } from './civicgrant-preset';
import { CurrentLanguage } from './language/current-language';
import { TranslatedTitleStrategy } from './language/translated-title-strategy';
import { TranslationLoader } from './language/translation-loader';
import { UiLanguage, uiLanguages } from './language/ui-language';
import { RuntimeConfig } from './runtime-config';

export function appConfig(
  config: RuntimeConfig,
  session: Session,
  language: UiLanguage,
): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes, withComponentInputBinding()),
      { provide: TitleStrategy, useExisting: TranslatedTitleStrategy },
      provideHttpClient(withInterceptors([accessTokenInterceptor])),
      { provide: Session, useValue: session },
      provideTransloco({
        config: {
          availableLangs: [...uiLanguages],
          defaultLang: language,
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslationLoader,
      }),
      provideAppInitializer(() => inject(CurrentLanguage).use(language)),
      provideAppInitializer(() => inject(CurrentUser).load()),
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
