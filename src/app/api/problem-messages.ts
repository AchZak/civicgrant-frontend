import { Problem } from './problem';

const translatedCodes: ReadonlySet<string> = new Set([
  'concurrentUpdate',
  'roleRequired',
  'payloadTooLarge',
  'notTheApplicant',
  'applicationNotDraft',
  'fundingCallClosed',
  'submissionBeforeOpeningDate',
  'submissionAfterClosingDate',
  'supportingDocumentRequired',
  'requestedAmountExceedsCap',
  'requestedAmountExceedsProjectBudget',
  'requestedAmountNotPositive',
  'legalFormNotEligible',
  'projectTitleRequired',
  'projectTitleTooLong',
  'projectDescriptionRequired',
  'projectDescriptionTooLong',
  'amountNegative',
  'amountTooPrecise',
  'documentNotPdf',
  'documentEmpty',
  'documentTooLarge',
  'documentNameInvalid',
  'enterpriseNumberInvalidFormat',
  'enterpriseNumberInvalidChecksum',
  'organisationNameRequired',
  'organisationNameTooLong',
  'organisationAlreadyRegistered',
  'schemaViolation',
  'invalidInput',
  'referencedResourceNotFound',
]);

export function problemKey(problem: Problem): string {
  return codeKey(problem.code) ?? fallbackKey(problem.status);
}

export function codeKey(code: string | undefined): string | undefined {
  return code !== undefined && translatedCodes.has(code) ? `problems.code.${code}` : undefined;
}

function fallbackKey(status: number): string {
  if (status === 0) {
    return 'problems.fallback.unreachable';
  }
  if (status === 401) {
    return 'problems.fallback.signInAgain';
  }
  if (status === 403) {
    return 'problems.fallback.forbidden';
  }
  if (status === 404) {
    return 'problems.fallback.notFound';
  }
  if (status === 409) {
    return 'problems.fallback.conflict';
  }
  if (status >= 400 && status < 500) {
    return 'problems.fallback.invalid';
  }
  return 'problems.fallback.serverError';
}
