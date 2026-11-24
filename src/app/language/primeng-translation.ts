import { Translation } from 'primeng/api';

export type PrimeNgTexts = Omit<Translation, 'fileSizeTypes'> & { fileSizeTypes: string };

// PrimeNG merges this shallowly: `aria` replaces its default object, so the files list every label.
export function primeNgTranslation(texts: PrimeNgTexts): Translation {
  return { ...texts, fileSizeTypes: texts.fileSizeTypes.split(',') };
}
