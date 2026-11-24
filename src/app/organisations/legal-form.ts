import { LegalForm } from './organisations-api';

const labels: Readonly<Record<LegalForm, string>> = {
  VZW_ASBL: $localize`:@@legalForm.VZW_ASBL:Non-profit association`,
  IVZW_AISBL: $localize`:@@legalForm.IVZW_AISBL:International non-profit association`,
  FOUNDATION: $localize`:@@legalForm.FOUNDATION:Foundation`,
  COMPANY: $localize`:@@legalForm.COMPANY:Company`,
  PUBLIC_BODY: $localize`:@@legalForm.PUBLIC_BODY:Public body`,
};

const legalForms: readonly LegalForm[] = [
  'VZW_ASBL',
  'IVZW_AISBL',
  'FOUNDATION',
  'COMPANY',
  'PUBLIC_BODY',
];

export const legalFormOptions = legalForms.map((value) => ({ label: labels[value], value }));

export function legalFormLabel(legalForm: LegalForm): string {
  return Object.hasOwn(labels, legalForm)
    ? labels[legalForm]
    : $localize`:@@legalForm.unknown:Other legal form`;
}
