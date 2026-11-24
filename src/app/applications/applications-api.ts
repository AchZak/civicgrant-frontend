import { httpResource } from '@angular/common/http';
import { components } from '../api/schema';

export type Application = components['schemas']['Application'];
export type ApplicationSummary = components['schemas']['ApplicationSummary'];
export type ApplicationStatus = components['schemas']['ApplicationStatus'];
type ApplicationPage = components['schemas']['ApplicationPage'];

export interface ApplicationsQuery {
  readonly page: number;
  readonly pageSize: number;
}

const applicationsUrl = '/api/v1/applications';

export function applicationPageResource(query: () => ApplicationsQuery) {
  return httpResource<ApplicationPage>(() => ({
    url: applicationsUrl,
    params: { page: query().page, pageSize: query().pageSize },
  }));
}
