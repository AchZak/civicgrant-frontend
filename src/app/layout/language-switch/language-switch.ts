import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrentLanguage } from '../../language/current-language';
import { localeOf, UiLanguage } from '../../language/ui-language';

interface LanguageChoice {
  readonly language: UiLanguage;
  readonly code: string;
  readonly name: string;
}

// Each language's name in that language, so a reader finds their own.
const choices: readonly LanguageChoice[] = [
  { language: 'nl', code: 'NL', name: 'Nederlands' },
  { language: 'fr', code: 'FR', name: 'Français' },
  { language: 'en', code: 'EN', name: 'English' },
];

@Component({
  imports: [TranslocoDirective],
  selector: 'app-language-switch',
  templateUrl: './language-switch.html',
})
export class LanguageSwitch {
  private readonly currentLanguage = inject(CurrentLanguage);

  protected readonly choices = choices;
  protected readonly language = this.currentLanguage.language;
  protected readonly localeOf = localeOf;

  protected choose(language: UiLanguage): void {
    void this.currentLanguage.choose(language);
  }
}
