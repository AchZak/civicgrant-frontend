import { ApplicationStatus } from './applications-api';

type TagSeverity = 'secondary' | 'info' | 'success' | 'danger';

const labels: Readonly<Record<ApplicationStatus, string>> = {
  DRAFT: $localize`:@@applicationStatus.DRAFT:Draft`,
  SUBMITTED: $localize`:@@applicationStatus.SUBMITTED:Submitted`,
  ASSESSED: $localize`:@@applicationStatus.ASSESSED:Assessed`,
  APPROVED: $localize`:@@applicationStatus.APPROVED:Approved`,
  REJECTED: $localize`:@@applicationStatus.REJECTED:Rejected`,
};

const severities: Readonly<Record<ApplicationStatus, TagSeverity>> = {
  DRAFT: 'secondary',
  SUBMITTED: 'info',
  ASSESSED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
};

export function applicationStatusLabel(status: ApplicationStatus): string {
  return Object.hasOwn(labels, status)
    ? labels[status]
    : $localize`:@@applicationStatus.unknown:Unknown status`;
}

export function applicationStatusSeverity(status: ApplicationStatus): TagSeverity {
  return Object.hasOwn(severities, status) ? severities[status] : 'secondary';
}
