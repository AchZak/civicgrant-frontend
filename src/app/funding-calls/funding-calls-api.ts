import { httpResource } from '@angular/common/http';
import { components } from '../api/schema';

export type FundingCall = components['schemas']['FundingCall'];
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
