import { Routes } from '@angular/router';
import { FundingCallDetail } from './funding-call-detail/funding-call-detail';
import { OpenFundingCalls } from './open-funding-calls/open-funding-calls';

export const fundingCallsRoutes: Routes = [
  {
    path: '',
    title: $localize`:@@fundingCalls.open.title:Open funding calls`,
    component: OpenFundingCalls,
  },
  {
    path: ':fundingCallId',
    title: $localize`:@@fundingCalls.detail.title:Funding call`,
    component: FundingCallDetail,
  },
];
