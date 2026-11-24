import { RejectionGround } from './applications-api';

const labelKeys: Readonly<Record<RejectionGround, string>> = {
  INELIGIBLE: 'applications.rejectionGround.ineligible',
  BUDGET_EXHAUSTED: 'applications.rejectionGround.budgetExhausted',
  INCOMPLETE: 'applications.rejectionGround.incomplete',
  INSUFFICIENT_QUALITY: 'applications.rejectionGround.insufficientQuality',
};

export function rejectionGroundKey(ground: RejectionGround): string {
  return Object.hasOwn(labelKeys, ground)
    ? labelKeys[ground]
    : 'applications.rejectionGround.unknown';
}
