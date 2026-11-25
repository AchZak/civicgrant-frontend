import {
  applyWhen,
  FieldTree,
  max,
  maxLength,
  ReadonlyFieldTree,
  required,
  schema,
} from '@angular/forms/signals';
import { codeKey } from '../api/problem-messages';
import { onceTouched } from '../shared/server-errors';
import { DecisionOutcome, DecisionRequest, RejectionGround } from './applications-api';

export interface DecisionModel {
  outcome: DecisionOutcome | null;
  grantedAmount: number | null;
  rejectionGround: RejectionGround | null;
  motivation: string;
}

const outcomeKeys: Readonly<Record<DecisionOutcome, string>> = {
  APPROVED: 'applications.decisionOutcome.approved',
  REJECTED: 'applications.decisionOutcome.rejected',
};

export const outcomes: readonly DecisionOutcome[] = ['APPROVED', 'REJECTED'];

export function outcomeKey(outcome: DecisionOutcome): string {
  return outcomeKeys[outcome];
}

// The assessor's proposed amount is the obvious start for an approval.
export function emptyDecision(proposedAmount: number | undefined): DecisionModel {
  return {
    outcome: null,
    grantedAmount: proposedAmount ?? null,
    rejectionGround: null,
    motivation: '',
  };
}

// The schema's required rules make sure the nulls are gone before this runs.
export function decisionRequestOf(model: DecisionModel): DecisionRequest | undefined {
  const { outcome, grantedAmount, rejectionGround, motivation } = model;
  if (outcome === 'APPROVED' && grantedAmount !== null) {
    return { outcome, grantedAmount, motivation };
  }
  if (outcome === 'REJECTED' && rejectionGround !== null) {
    return { outcome, rejectionGround, motivation };
  }
  return undefined;
}

// The contract asks for a granted amount on an approval and a ground on a rejection.
export function decisionSchema(requestedAmount: () => number) {
  return schema<DecisionModel>((path) => {
    required(path.outcome, {
      when: onceTouched,
      message: 'applications.decision.validation.outcomeRequired',
    });
    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.outcome) === 'APPROVED',
      (approval) => {
        required(approval.grantedAmount, {
          when: onceTouched,
          message: 'applications.decision.validation.grantedAmountRequired',
        });
        max(approval.grantedAmount, requestedAmount, {
          message: codeKey('grantedAmountExceedsRequested'),
        });
      },
    );
    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.outcome) === 'REJECTED',
      (rejection) => {
        required(rejection.rejectionGround, {
          when: onceTouched,
          message: 'applications.decision.validation.rejectionGroundRequired',
        });
      },
    );
    required(path.motivation, { when: onceTouched, message: codeKey('motivationRequired') });
    maxLength(path.motivation, 4000, { message: codeKey('motivationTooLong') });
  });
}

export function decisionFields(
  fields: FieldTree<DecisionModel>,
): Readonly<Record<string, ReadonlyFieldTree<unknown>>> {
  return {
    outcome: fields.outcome,
    grantedAmount: fields.grantedAmount,
    rejectionGround: fields.rejectionGround,
    motivation: fields.motivation,
  };
}

export const decisionFieldOfCode: Readonly<Record<string, string>> = {
  motivationRequired: 'motivation',
  motivationTooLong: 'motivation',
  ineligibleApplicationCannotBeApproved: 'outcome',
  grantedAmountNotPositive: 'grantedAmount',
  grantedAmountExceedsRequested: 'grantedAmount',
  grantExceedsRemainingBudget: 'grantedAmount',
};
