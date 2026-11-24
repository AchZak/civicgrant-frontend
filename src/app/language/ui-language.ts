export const uiLanguages = ['nl', 'fr', 'en'] as const;

export type UiLanguage = (typeof uiLanguages)[number];

export const localeOf: Readonly<Record<UiLanguage, string>> = {
  nl: 'nl-BE',
  fr: 'fr-BE',
  en: 'en-BE',
};

const storageKey = 'civicgrant.language';

export function isUiLanguage(value: string | null | undefined): value is UiLanguage {
  return uiLanguages.some((language) => language === value);
}

export function initialLanguage(): UiLanguage {
  return storedLanguage() ?? browserLanguage() ?? 'nl';
}

export function storeLanguage(language: UiLanguage): void {
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // Storage can be blocked; the choice then lasts until the page is closed.
  }
}

function storedLanguage(): UiLanguage | undefined {
  try {
    const stored = localStorage.getItem(storageKey);
    return isUiLanguage(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

function browserLanguage(): UiLanguage | undefined {
  return navigator.languages.map((tag) => tag.slice(0, 2).toLowerCase()).find(isUiLanguage);
}
