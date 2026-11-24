import { Component, computed, inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

interface Language {
  readonly locale: string;
  readonly code: string;
  readonly name: string;
  readonly basePath: string;
}

// basePath matches each locale's subPath in angular.json.
const languages: readonly Language[] = [
  { locale: 'nl-BE', code: 'NL', name: 'Nederlands', basePath: '/nl' },
  { locale: 'fr-BE', code: 'FR', name: 'Français', basePath: '/fr' },
];

@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  private readonly router = inject(Router);

  protected readonly currentLocale = inject(LOCALE_ID);
  protected readonly languages = languages;

  private readonly currentPath = computed(() => {
    const finalUrl = this.router.lastSuccessfulNavigation()?.finalUrl;
    return finalUrl ? this.router.serializeUrl(finalUrl) : '/';
  });

  protected href(language: Language): string {
    return language.basePath + this.currentPath();
  }
}
