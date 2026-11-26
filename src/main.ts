import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { startSession } from './app/auth/start-session';
import { initialLanguage, localeOf, UiLanguage } from './app/language/ui-language';
import { loadRuntimeConfig } from './app/runtime-config';

// Shown before the app runs, so Transloco isn't there to translate them. Angular replaces
// the loading text once the app renders; the API may take a while to wake up first.
const loading: Readonly<Record<UiLanguage, string>> = {
  nl: 'CivicGrant wordt geladen. Na een rustige periode kan het opstarten tot een minuut duren.',
  fr: 'Chargement de CivicGrant. Après une période calme, le démarrage peut prendre jusqu’à une minute.',
  en: 'Loading CivicGrant. After a quiet period, starting up can take up to a minute.',
};

const unavailable: Readonly<Record<UiLanguage, string>> = {
  nl: 'CivicGrant is momenteel niet beschikbaar. Probeer het later opnieuw.',
  fr: 'CivicGrant est momentanément indisponible. Veuillez réessayer plus tard.',
  en: 'CivicGrant is unavailable right now. Please try again later.',
};

const language = initialLanguage();
document.documentElement.lang = localeOf[language];
document.getElementById('app-loading')?.replaceChildren(loading[language]);

async function start(): Promise<void> {
  const config = await loadRuntimeConfig();
  const session = await startSession(config.entra);
  if (session) {
    await bootstrapApplication(App, appConfig(config, session, language));
  }
}

start().catch((error: unknown) => {
  console.error(error);
  document.body.textContent = unavailable[language];
});
