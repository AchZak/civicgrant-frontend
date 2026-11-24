import { RejectionGround } from './applications-api';

const labels: Readonly<Record<RejectionGround, string>> = {
  INELIGIBLE: $localize`:@@rejectionGround.INELIGIBLE:The application isn't eligible`,
  BUDGET_EXHAUSTED: $localize`:@@rejectionGround.BUDGET_EXHAUSTED:The funding call's budget is exhausted`,
  INCOMPLETE: $localize`:@@rejectionGround.INCOMPLETE:The application is incomplete`,
  INSUFFICIENT_QUALITY: $localize`:@@rejectionGround.INSUFFICIENT_QUALITY:The project's quality is insufficient`,
};

export function rejectionGroundLabel(ground: RejectionGround): string {
  return Object.hasOwn(labels, ground)
    ? labels[ground]
    : $localize`:@@rejectionGround.unknown:Another ground`;
}
