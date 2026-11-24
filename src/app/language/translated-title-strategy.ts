import { effect, inject, Service, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { CurrentLanguage } from './current-language';

// Route titles are translation keys, so the tab title follows a language switch too.
@Service()
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly transloco = inject(TranslocoService);
  private readonly language = inject(CurrentLanguage).language;
  private readonly titleKey = signal<string | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const key = this.titleKey();
      this.language();
      if (key !== undefined) {
        this.title.setTitle(this.transloco.translate(key));
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.titleKey.set(this.buildTitle(snapshot));
  }
}
