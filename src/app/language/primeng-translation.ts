import { Translation } from 'primeng/api';

type ListKey =
  'fileSizeTypes' | 'dayNames' | 'dayNamesShort' | 'dayNamesMin' | 'monthNames' | 'monthNamesShort';

export type PrimeNgTexts = Omit<Translation, ListKey> & Record<ListKey, string>;

// PrimeNG merges this shallowly: `aria` replaces its default object, so the files list every label.
export function primeNgTranslation(texts: PrimeNgTexts): Translation {
  return {
    ...texts,
    fileSizeTypes: texts.fileSizeTypes.split(','),
    dayNames: texts.dayNames.split(','),
    dayNamesShort: texts.dayNamesShort.split(','),
    dayNamesMin: texts.dayNamesMin.split(','),
    monthNames: texts.monthNames.split(','),
    monthNamesShort: texts.monthNamesShort.split(','),
  };
}
