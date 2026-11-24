import { Service } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { isUiLanguage, UiLanguage } from './ui-language';

// Imported rather than fetched, so the build gives each file a hashed name and no browser keeps old texts.
const translationFiles: Readonly<Record<UiLanguage, () => Promise<{ default: Translation }>>> = {
  nl: () => import('../../i18n/nl.json'),
  fr: () => import('../../i18n/fr.json'),
  en: () => import('../../i18n/en.json'),
};

@Service()
export class TranslationLoader implements TranslocoLoader {
  async getTranslation(language: string): Promise<Translation> {
    if (!isUiLanguage(language)) {
      throw new Error(`No translations for ${language}`);
    }
    const file = await translationFiles[language]();
    return file.default;
  }
}
