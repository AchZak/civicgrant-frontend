import { HttpClient, HttpEventType, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { components } from '../api/schema';

export type Application = components['schemas']['Application'];
export type ApplicationSummary = components['schemas']['ApplicationSummary'];
export type ApplicationStatus = components['schemas']['ApplicationStatus'];
export type ProjectProposal = components['schemas']['ProjectProposal'];
export type Assessment = components['schemas']['Assessment'];
export type AssessmentRequest = components['schemas']['AssessmentRequest'];
export type Recommendation = components['schemas']['Recommendation'];
export type Decision = components['schemas']['Decision'];
export type DecisionRequest = components['schemas']['DecisionRequest'];
export type DecisionOutcome = components['schemas']['DecisionOutcome'];
export type RejectionGround = components['schemas']['RejectionGround'];
export type SupportingDocument = components['schemas']['SupportingDocument'];
type ApplicationPage = components['schemas']['ApplicationPage'];
type CreateApplicationRequest = components['schemas']['CreateApplicationRequest'];

export interface ApplicationsQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly status?: ApplicationStatus;
}

const applicationsUrl = '/api/v1/applications';

export function applicationPageResource(query: () => ApplicationsQuery) {
  return httpResource<ApplicationPage>(() => {
    const { page, pageSize, status } = query();
    const params: Record<string, string | number> = { page, pageSize };
    if (status !== undefined) {
      params['status'] = status;
    }
    return { url: applicationsUrl, params };
  });
}

export function applicationResource(applicationId: () => string) {
  return httpResource<Application>(() => `${applicationsUrl}/${applicationId()}`);
}

export function assessmentResource(applicationId: () => string | undefined) {
  return httpResource<Assessment>(() => {
    const id = applicationId();
    return id === undefined ? undefined : `${applicationsUrl}/${id}/assessment`;
  });
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

  async submit(applicationId: string): Promise<void> {
    await firstValueFrom(this.http.post(`${applicationsUrl}/${applicationId}/submission`, null));
  }

  async recordAssessment(applicationId: string, request: AssessmentRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${applicationsUrl}/${applicationId}/assessment`, request));
  }

  async decide(applicationId: string, request: DecisionRequest): Promise<void> {
    await firstValueFrom(this.http.post(`${applicationsUrl}/${applicationId}/decision`, request));
  }

  async attachDocument(
    applicationId: string,
    file: File,
    onProgress: (percent: number) => void,
  ): Promise<void> {
    const body = new FormData();
    body.append('file', file, file.name);
    await lastValueFrom(
      this.http
        .post(`${applicationsUrl}/${applicationId}/documents`, body, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          tap((event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              onProgress(Math.round((100 * event.loaded) / event.total));
            }
          }),
        ),
    );
  }

  async removeDocument(applicationId: string, documentId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${applicationsUrl}/${applicationId}/documents/${documentId}`),
    );
  }

  downloadDocument(applicationId: string, documentId: string): Promise<Blob> {
    return firstValueFrom(
      this.http.get(`${applicationsUrl}/${applicationId}/documents/${documentId}/content`, {
        responseType: 'blob',
      }),
    );
  }
}
