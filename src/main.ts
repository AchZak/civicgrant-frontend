/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { startSession } from './app/auth/start-session';
import { loadRuntimeConfig } from './app/runtime-config';

async function start(): Promise<void> {
  const config = await loadRuntimeConfig();
  const session = await startSession(config.entra);
  if (session) {
    await bootstrapApplication(App, appConfig(config, session));
  }
}

start().catch((error: unknown) => {
  console.error(error);
  document.body.textContent = $localize`:@@app.unavailable:CivicGrant is unavailable right now. Please try again later.`;
});
