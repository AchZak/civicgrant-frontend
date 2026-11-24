import { components } from '../api/schema';

type Language = components['schemas']['Language'];

const languageLabels: Readonly<Record<Language, string>> = {
  NL: $localize`:@@language.NL:Dutch`,
  FR: $localize`:@@language.FR:French`,
};

export function languageLabel(language: Language): string {
  return Object.hasOwn(languageLabels, language) ? languageLabels[language] : language;
}
