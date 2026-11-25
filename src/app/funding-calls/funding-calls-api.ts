import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { components } from '../api/schema';

export type FundingCall = components['schemas']['FundingCall'];
export type OpenFundingCallRequest = components['schemas']['OpenFundingCallRequest'];
type FundingCallCollection = components['schemas']['FundingCallCollection'];

const fundingCallsUrl = '/api/v1/fundingCalls';

export function openFundingCallsResource() {
  return httpResource<FundingCallCollection>(() => fundingCallsUrl);
}

export function fundingCallResource(fundingCallId: () => string | undefined) {
  return httpResource<FundingCall>(() => {
    const id = fundingCallId();
    return id === undefined ? undefined : `${fundingCallsUrl}/${id}`;
  });
}

@Service()
export class FundingCallsApi {
  private readonly http = inject(HttpClient);

  open(request: OpenFundingCallRequest): Promise<FundingCall> {
    return firstValueFrom(this.http.post<FundingCall>(fundingCallsUrl, request));
  }
}
