import {
  FieldTree,
  max,
  maxLength,
  ReadonlyFieldTree,
  required,
  schema,
} from '@angular/forms/signals';
import { codeKey } from '../api/problem-messages';
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

const languageKeys: Readonly<Record<Language, string>> = {
  NL: 'applications.language.nl',
  FR: 'applications.language.fr',
};

export const languages: readonly Language[] = ['NL', 'FR'];

export function languageKey(language: Language): string {
  return languageKeys[language];
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
    required(path.title, { when: onceTouched, message: codeKey('projectTitleRequired') });
    maxLength(path.title, 200, { message: codeKey('projectTitleTooLong') });
    required(path.description, {
      when: onceTouched,
      message: codeKey('projectDescriptionRequired'),
    });
    maxLength(path.description, 10000, { message: codeKey('projectDescriptionTooLong') });
    required(path.requestedAmount, {
      when: onceTouched,
      message: 'applications.validation.requestedAmountRequired',
    });
    max(path.requestedAmount, capPerApplication, {
      message: codeKey('requestedAmountExceedsCap'),
    });
    required(path.totalProjectBudget, {
      when: onceTouched,
      message: 'applications.validation.totalProjectBudgetRequired',
    });
    required(path.language, {
      when: onceTouched,
      message: 'applications.validation.languageRequired',
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
