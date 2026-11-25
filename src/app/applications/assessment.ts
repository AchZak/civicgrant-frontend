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
import { AssessmentRequest, Recommendation } from './applications-api';

export interface AssessmentModel {
  eligible: boolean | null;
  recommendation: Recommendation | null;
  proposedAmount: number | null;
  comment: string;
}

const recommendationKeys: Readonly<Record<Recommendation, string>> = {
  APPROVE: 'applications.recommendation.approve',
  REJECT: 'applications.recommendation.reject',
};

export const recommendations: readonly Recommendation[] = ['APPROVE', 'REJECT'];

export function recommendationKey(recommendation: Recommendation): string {
  return recommendationKeys[recommendation];
}

export function emptyAssessment(): AssessmentModel {
  return { eligible: null, recommendation: null, proposedAmount: null, comment: '' };
}

// The schema's required rules make sure the nulls are gone before this runs.
export function assessmentRequestOf(model: AssessmentModel): AssessmentRequest | undefined {
  const { eligible, recommendation, proposedAmount, comment } = model;
  if (eligible === null || recommendation === null) {
    return undefined;
  }
  if (recommendation === 'REJECT') {
    return { eligible, recommendation, comment };
  }
  return proposedAmount === null
    ? undefined
    : { eligible, recommendation, proposedAmount, comment };
}

// The contract asks for a proposed amount only when the assessor recommends approval.
export function assessmentSchema(requestedAmount: () => number) {
  return schema<AssessmentModel>((path) => {
    required(path.eligible, {
      when: onceTouched,
      message: 'applications.assessment.validation.eligibleRequired',
    });
    required(path.recommendation, {
      when: onceTouched,
      message: 'applications.assessment.validation.recommendationRequired',
    });
    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.recommendation) === 'APPROVE',
      (approval) => {
        required(approval.proposedAmount, {
          when: onceTouched,
          message: 'applications.assessment.validation.proposedAmountRequired',
        });
        max(approval.proposedAmount, requestedAmount, {
          message: codeKey('proposedAmountExceedsRequested'),
        });
      },
    );
    required(path.comment, { when: onceTouched, message: codeKey('assessmentCommentRequired') });
    maxLength(path.comment, 4000, { message: codeKey('assessmentCommentTooLong') });
  });
}

export function assessmentFields(
  fields: FieldTree<AssessmentModel>,
): Readonly<Record<string, ReadonlyFieldTree<unknown>>> {
  return {
    eligible: fields.eligible,
    recommendation: fields.recommendation,
    proposedAmount: fields.proposedAmount,
    comment: fields.comment,
  };
}

export const assessmentFieldOfCode: Readonly<Record<string, string>> = {
  assessmentCommentRequired: 'comment',
  assessmentCommentTooLong: 'comment',
  approvalRecommendationRequiresEligibility: 'recommendation',
  proposedAmountNotPositive: 'proposedAmount',
  proposedAmountExceedsRequested: 'proposedAmount',
};
