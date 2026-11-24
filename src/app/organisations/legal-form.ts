import { LegalForm } from './organisations-api';

const labelKeys: Readonly<Record<LegalForm, string>> = {
  VZW_ASBL: 'organisations.legalForm.vzwAsbl',
  IVZW_AISBL: 'organisations.legalForm.ivzwAisbl',
  FOUNDATION: 'organisations.legalForm.foundation',
  COMPANY: 'organisations.legalForm.company',
  PUBLIC_BODY: 'organisations.legalForm.publicBody',
};

export const legalForms: readonly LegalForm[] = [
  'VZW_ASBL',
  'IVZW_AISBL',
  'FOUNDATION',
  'COMPANY',
  'PUBLIC_BODY',
];

export function legalFormKey(legalForm: LegalForm): string {
  return Object.hasOwn(labelKeys, legalForm)
    ? labelKeys[legalForm]
    : 'organisations.legalForm.unknown';
}
