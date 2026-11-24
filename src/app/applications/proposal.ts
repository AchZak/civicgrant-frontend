import {
  FieldTree,
  max,
  maxLength,
  ReadonlyFieldTree,
  required,
  schema,
} from '@angular/forms/signals';
import { codeMessage } from '../api/problem-messages';
import { components } from '../api/schema';
import { onceTouched } from '../shared/server-errors';
import { ProjectProposal } from './applications-api';

type Language = components['schemas']['Language'];

export interface ProposalModel {
  title: string;
  description: string;
  requestedAmount: number | null;
  totalProjectBudget: number | null;
  language: Language | null;
}

const languageLabels: Readonly<Record<Language, string>> = {
  NL: $localize`:@@language.NL:Dutch`,
  FR: $localize`:@@language.FR:French`,
};

const languages: readonly Language[] = ['NL', 'FR'];

export const languageOptions = languages.map((value) => ({ label: languageLabels[value], value }));

export function languageLabel(language: Language): string {
  return Object.hasOwn(languageLabels, language) ? languageLabels[language] : language;
}

export function emptyProposal(): ProposalModel {
  return {
    title: '',
    description: '',
    requestedAmount: null,
    totalProjectBudget: null,
    language: null,
  };
}

export function proposalModelOf(proposal: ProjectProposal): ProposalModel {
  return { ...proposal };
}

// The schema's required rules make sure the nulls are gone before this runs.
export function proposalOf(model: ProposalModel): ProjectProposal | undefined {
  const { title, description, requestedAmount, totalProjectBudget, language } = model;
  if (requestedAmount === null || totalProjectBudget === null || language === null) {
    return undefined;
  }
  return { title, description, requestedAmount, totalProjectBudget, language };
}

export function proposalSchema(capPerApplication: () => number | undefined) {
  return schema<ProposalModel>((path) => {
    required(path.title, { when: onceTouched, message: codeMessage('projectTitleRequired') });
    maxLength(path.title, 200, { message: codeMessage('projectTitleTooLong') });
    required(path.description, {
      when: onceTouched,
      message: codeMessage('projectDescriptionRequired'),
    });
    maxLength(path.description, 10000, { message: codeMessage('projectDescriptionTooLong') });
    required(path.requestedAmount, {
      when: onceTouched,
      message: $localize`:@@proposal.requestedAmount.required:Enter the amount you request.`,
    });
    max(path.requestedAmount, capPerApplication, {
      message: codeMessage('requestedAmountExceedsCap'),
    });
    required(path.totalProjectBudget, {
      when: onceTouched,
      message: $localize`:@@proposal.totalProjectBudget.required:Enter the total budget of the project.`,
    });
    required(path.language, {
      when: onceTouched,
      message: $localize`:@@proposal.language.required:Choose the language of the project.`,
    });
  });
}

// The create request nests the proposal, so the API names its fields "proposal.title".
export function proposalFields(
  fields: FieldTree<ProposalModel>,
  prefix = '',
): Readonly<Record<string, ReadonlyFieldTree<unknown>>> {
  return {
    [`${prefix}title`]: fields.title,
    [`${prefix}description`]: fields.description,
    [`${prefix}requestedAmount`]: fields.requestedAmount,
    [`${prefix}totalProjectBudget`]: fields.totalProjectBudget,
    [`${prefix}language`]: fields.language,
  };
}

export function proposalFieldOfCode(prefix = ''): Readonly<Record<string, string>> {
  return {
    projectTitleRequired: `${prefix}title`,
    projectTitleTooLong: `${prefix}title`,
    projectDescriptionRequired: `${prefix}description`,
    projectDescriptionTooLong: `${prefix}description`,
    requestedAmountNotPositive: `${prefix}requestedAmount`,
    requestedAmountExceedsCap: `${prefix}requestedAmount`,
    requestedAmountExceedsProjectBudget: `${prefix}requestedAmount`,
  };
}
