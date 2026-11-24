import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { components } from '../api/schema';

export type Application = components['schemas']['Application'];
export type ApplicationSummary = components['schemas']['ApplicationSummary'];
export type ApplicationStatus = components['schemas']['ApplicationStatus'];
export type ProjectProposal = components['schemas']['ProjectProposal'];
export type Decision = components['schemas']['Decision'];
export type RejectionGround = components['schemas']['RejectionGround'];
type ApplicationPage = components['schemas']['ApplicationPage'];
type CreateApplicationRequest = components['schemas']['CreateApplicationRequest'];

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

export function applicationResource(applicationId: () => string) {
  return httpResource<Application>(() => `${applicationsUrl}/${applicationId()}`);
}

export function decisionResource(applicationId: () => string | undefined) {
  return httpResource<Decision>(() => {
    const id = applicationId();
    return id === undefined ? undefined : `${applicationsUrl}/${id}/decision`;
  });
}

@Service()
export class ApplicationsApi {
  private readonly http = inject(HttpClient);

  create(request: CreateApplicationRequest): Promise<Application> {
    return firstValueFrom(this.http.post<Application>(applicationsUrl, request));
  }

  editProposal(applicationId: string, proposal: ProjectProposal): Promise<Application> {
    return firstValueFrom(
      this.http.put<Application>(`${applicationsUrl}/${applicationId}/proposal`, proposal),
    );
  }
}
