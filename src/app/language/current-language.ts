import { DOCUMENT } from '@angular/common';
import { computed, inject, Service, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { PrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';
import { primeNgTranslation, PrimeNgTexts } from './primeng-translation';
import { localeOf, storeLanguage, UiLanguage } from './ui-language';

@Service()
export class CurrentLanguage {
  private readonly transloco = inject(TranslocoService);
  private readonly primeNg = inject(PrimeNG);
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<UiLanguage>('nl');

  readonly language = this.current.asReadonly();
  readonly locale = computed(() => localeOf[this.current()]);

  // LocalizedText only has nl and fr, so the English UI shows the Dutch text, marked as Dutch.
  readonly localizedTextLanguage = computed(() => (this.current() === 'fr' ? 'fr' : 'nl'));
  readonly localizedTextLang = computed(() => (this.current() === 'en' ? 'nl' : null));

  async use(language: UiLanguage): Promise<void> {
    await firstValueFrom(this.transloco.load(language));
    this.transloco.setActiveLang(language);
    this.current.set(language);
    this.document.documentElement.lang = localeOf[language];
    this.primeNg.setTranslation(
      primeNgTranslation(this.transloco.translateObject<PrimeNgTexts>('primeng')),
    );
  }

  async choose(language: UiLanguage): Promise<void> {
    await this.use(language);
    storeLanguage(language);
  }
}
