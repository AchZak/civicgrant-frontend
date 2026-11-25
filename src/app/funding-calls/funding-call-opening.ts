import {
  FieldTree,
  maxLength,
  pattern,
  ReadonlyFieldTree,
  required,
  schema,
} from '@angular/forms/signals';
import { codeKey } from '../api/problem-messages';
import { onceTouched } from '../shared/server-errors';
import { endOfBrusselsDay, startOfBrusselsDay } from './brussels-day';
import { OpenFundingCallRequest } from './funding-calls-api';

export interface FundingCallOpeningModel {
  reference: string;
  title: { nl: string; fr: string };
  firstDay: Date | null;
  lastDay: Date | null;
  totalBudget: number | null;
  maxAmountPerApplication: number | null;
}

export function emptyFundingCallOpening(): FundingCallOpeningModel {
  return {
    reference: '',
    title: { nl: '', fr: '' },
    firstDay: null,
    lastDay: null,
    totalBudget: null,
    maxAmountPerApplication: null,
  };
}

// The call accepts applications from the start of the first day to the end of the last, in Brussels.
// The schema's required rules make sure the nulls are gone before this runs.
export function openFundingCallRequestOf(
  model: FundingCallOpeningModel,
): OpenFundingCallRequest | undefined {
  const { reference, title, firstDay, lastDay, totalBudget, maxAmountPerApplication } = model;
  if (
    firstDay === null ||
    lastDay === null ||
    totalBudget === null ||
    maxAmountPerApplication === null
  ) {
    return undefined;
  }
  return {
    reference,
    title,
    opensAt: startOfBrusselsDay(firstDay),
    closesAt: endOfBrusselsDay(lastDay),
    totalBudget,
    maxAmountPerApplication,
  };
}

export const fundingCallOpeningSchema = schema<FundingCallOpeningModel>((path) => {
  required(path.reference, {
    when: onceTouched,
    message: 'fundingCalls.validation.referenceRequired',
  });
  maxLength(path.reference, 30, { message: codeKey('fundingCallReferenceInvalid') });
  pattern(path.reference, /^[A-Z0-9-]+$/, { message: codeKey('fundingCallReferenceInvalid') });
  required(path.title.nl, { when: onceTouched, message: 'fundingCalls.validation.titleRequired' });
  maxLength(path.title.nl, 200, { message: codeKey('fundingCallTitleTooLong') });
  required(path.title.fr, { when: onceTouched, message: 'fundingCalls.validation.titleRequired' });
  maxLength(path.title.fr, 200, { message: codeKey('fundingCallTitleTooLong') });
  required(path.firstDay, {
    when: onceTouched,
    message: 'fundingCalls.validation.firstDayRequired',
  });
  required(path.lastDay, { when: onceTouched, message: 'fundingCalls.validation.lastDayRequired' });
  required(path.totalBudget, {
    when: onceTouched,
    message: 'fundingCalls.validation.totalBudgetRequired',
  });
  required(path.maxAmountPerApplication, {
    when: onceTouched,
    message: 'fundingCalls.validation.maxAmountPerApplicationRequired',
  });
});

export function fundingCallOpeningFields(
  fields: FieldTree<FundingCallOpeningModel>,
): Readonly<Record<string, ReadonlyFieldTree<unknown>>> {
  return {
    reference: fields.reference,
    'title.nl': fields.title.nl,
    'title.fr': fields.title.fr,
    opensAt: fields.firstDay,
    closesAt: fields.lastDay,
    totalBudget: fields.totalBudget,
    maxAmountPerApplication: fields.maxAmountPerApplication,
  };
}

// The title codes don't say which language, so they stay on the form.
export const fundingCallOpeningFieldOfCode: Readonly<Record<string, string>> = {
  fundingCallReferenceInvalid: 'reference',
  fundingCallReferenceTaken: 'reference',
  submissionPeriodClosesBeforeOpening: 'closesAt',
  fundingCallAlreadyClosed: 'closesAt',
  totalBudgetNotPositive: 'totalBudget',
  capPerApplicationNotPositive: 'maxAmountPerApplication',
  capPerApplicationExceedsBudget: 'maxAmountPerApplication',
};
