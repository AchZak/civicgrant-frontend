import { ApplicationStatus } from './applications-api';

type TagSeverity = 'secondary' | 'info' | 'success' | 'danger';

const labelKeys: Readonly<Record<ApplicationStatus, string>> = {
  DRAFT: 'applications.status.draft',
  SUBMITTED: 'applications.status.submitted',
  ASSESSED: 'applications.status.assessed',
  APPROVED: 'applications.status.approved',
  REJECTED: 'applications.status.rejected',
};

const severities: Readonly<Record<ApplicationStatus, TagSeverity>> = {
  DRAFT: 'secondary',
  SUBMITTED: 'info',
  ASSESSED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
};

export function applicationStatusKey(status: ApplicationStatus): string {
  return Object.hasOwn(labelKeys, status) ? labelKeys[status] : 'applications.status.unknown';
}

export function applicationStatusSeverity(status: ApplicationStatus): TagSeverity {
  return Object.hasOwn(severities, status) ? severities[status] : 'secondary';
}
