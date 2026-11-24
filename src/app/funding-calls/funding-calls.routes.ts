import { Routes } from '@angular/router';
import { FundingCallDetail } from './funding-call-detail/funding-call-detail';
import { OpenFundingCalls } from './open-funding-calls/open-funding-calls';

export const fundingCallsRoutes: Routes = [
  {
    path: '',
    title: 'fundingCalls.open.title',
    component: OpenFundingCalls,
  },
  {
    path: ':fundingCallId',
    title: 'fundingCalls.detail.title',
    component: FundingCallDetail,
  },
];
