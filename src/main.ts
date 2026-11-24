/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { loadRuntimeConfig } from './app/runtime-config';

loadRuntimeConfig()
  .then((config) => bootstrapApplication(App, appConfig(config)))
  .catch((error: unknown) => {
    console.error(error);
    document.body.textContent = $localize`:@@app.unavailable:CivicGrant is unavailable right now. Please try again later.`;
  });
