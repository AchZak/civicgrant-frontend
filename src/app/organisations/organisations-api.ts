import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { components } from '../api/schema';

export type Organisation = components['schemas']['Organisation'];
export type LegalForm = components['schemas']['LegalForm'];
type OrganisationCollection = components['schemas']['OrganisationCollection'];
type RegisterOrganisationRequest = components['schemas']['RegisterOrganisationRequest'];

const organisationsUrl = '/api/v1/organisations';

export function organisationResource(organisationId: () => string | undefined) {
  return httpResource<Organisation>(() => {
    const id = organisationId();
    return id === undefined ? undefined : `${organisationsUrl}/${id}`;
  });
}

@Service()
export class OrganisationsApi {
  private readonly http = inject(HttpClient);

  async find(enterpriseNumber: string): Promise<Organisation | undefined> {
    const found = await firstValueFrom(
      this.http.get<OrganisationCollection>(organisationsUrl, { params: { enterpriseNumber } }),
    );
    return found.items[0];
  }

  register(request: RegisterOrganisationRequest): Promise<Organisation> {
    return firstValueFrom(this.http.post<Organisation>(organisationsUrl, request));
  }
}
