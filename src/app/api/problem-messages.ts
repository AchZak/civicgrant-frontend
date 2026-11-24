import { Problem } from './problem';

const messages: Readonly<Record<string, string>> = {
  concurrentUpdate: $localize`:@@problem.concurrentUpdate:Someone else changed this at the same time. Reload the page to see the latest version, then try again.`,
  roleRequired: $localize`:@@problem.roleRequired:Your account doesn't have the role this needs.`,
  payloadTooLarge: $localize`:@@problem.payloadTooLarge:The file is too large. A document can be at most 10 MB.`,
  notTheApplicant: $localize`:@@problem.notTheApplicant:Only the person who created this application can change it.`,
  applicationNotDraft: $localize`:@@problem.applicationNotDraft:This application has been submitted and can no longer be changed.`,
  fundingCallClosed: $localize`:@@problem.fundingCallClosed:This funding call is closed.`,
  submissionBeforeOpeningDate: $localize`:@@problem.submissionBeforeOpeningDate:This funding call isn't open for applications yet.`,
  submissionAfterClosingDate: $localize`:@@problem.submissionAfterClosingDate:This funding call has closed and no longer accepts applications.`,
  supportingDocumentRequired: $localize`:@@problem.supportingDocumentRequired:Attach at least one PDF document before you submit.`,
  requestedAmountExceedsCap: $localize`:@@problem.requestedAmountExceedsCap:The requested amount is more than this funding call's maximum per application.`,
  requestedAmountExceedsProjectBudget: $localize`:@@problem.requestedAmountExceedsProjectBudget:The requested amount can't be more than the total project budget.`,
  requestedAmountNotPositive: $localize`:@@problem.requestedAmountNotPositive:The requested amount must be more than zero.`,
  legalFormNotEligible: $localize`:@@problem.legalFormNotEligible:Only non-profits can apply: associations and foundations.`,
  projectTitleRequired: $localize`:@@problem.projectTitleRequired:Enter a project title.`,
  projectTitleTooLong: $localize`:@@problem.projectTitleTooLong:The project title can be at most 200 characters long.`,
  projectDescriptionRequired: $localize`:@@problem.projectDescriptionRequired:Describe the project.`,
  projectDescriptionTooLong: $localize`:@@problem.projectDescriptionTooLong:The description can be at most 10,000 characters long.`,
  amountNegative: $localize`:@@problem.amountNegative:An amount can't be negative.`,
  amountTooPrecise: $localize`:@@problem.amountTooPrecise:An amount has at most two decimals.`,
  documentNotPdf: $localize`:@@problem.documentNotPdf:Only PDF files can be attached.`,
  documentEmpty: $localize`:@@problem.documentEmpty:This file is empty.`,
  documentTooLarge: $localize`:@@problem.documentTooLarge:A document can be at most 10 MB.`,
  documentNameInvalid: $localize`:@@problem.documentNameInvalid:The file name isn't valid. Rename the file and try again.`,
  enterpriseNumberInvalidFormat: $localize`:@@problem.enterpriseNumberInvalidFormat:An enterprise number has 10 digits, such as 0123.456.749.`,
  enterpriseNumberInvalidChecksum: $localize`:@@problem.enterpriseNumberInvalidChecksum:This enterprise number isn't valid. Check it for typing errors.`,
  organisationNameRequired: $localize`:@@problem.organisationNameRequired:Enter the organisation's name.`,
  organisationNameTooLong: $localize`:@@problem.organisationNameTooLong:The organisation's name can be at most 200 characters long.`,
  organisationAlreadyRegistered: $localize`:@@problem.organisationAlreadyRegistered:This organisation is already registered. Look it up by its enterprise number.`,
  schemaViolation: $localize`:@@problem.schemaViolation:This value isn't valid.`,
  invalidInput: $localize`:@@problem.invalidInput:This value isn't valid.`,
  referencedResourceNotFound: $localize`:@@problem.referencedResourceNotFound:This no longer exists. Reload the page and try again.`,
};

export function problemMessage(problem: Problem): string {
  return codeMessage(problem.code) ?? statusMessage(problem.status);
}

export function codeMessage(code: string | undefined): string | undefined {
  return code !== undefined && Object.hasOwn(messages, code) ? messages[code] : undefined;
}

function statusMessage(status: number): string {
  if (status === 0) {
    return $localize`:@@problem.unreachable:CivicGrant can't be reached right now. Check your connection and try again.`;
  }
  if (status === 401) {
    return $localize`:@@problem.signInAgain:Your session has expired. Sign in again to continue.`;
  }
  if (status === 403) {
    return $localize`:@@problem.forbidden:You're not allowed to do this.`;
  }
  if (status === 404) {
    return $localize`:@@problem.notFound:This doesn't exist, or you may not see it.`;
  }
  if (status === 409) {
    return $localize`:@@problem.conflict:This can't be done in the current state. Reload the page and check the status.`;
  }
  if (status >= 400 && status < 500) {
    return $localize`:@@problem.invalid:Some of the information isn't valid. Check it and try again.`;
  }
  return $localize`:@@problem.serverError:Something went wrong on our side. Try again in a few minutes.`;
}
