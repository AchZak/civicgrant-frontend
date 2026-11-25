import { Routes } from '@angular/router';
import { requireAnyRole } from '../auth/role-guard';
import { FundingCallDetail } from './funding-call-detail/funding-call-detail';
import { NewFundingCall } from './new-funding-call/new-funding-call';
import { OpenFundingCalls } from './open-funding-calls/open-funding-calls';

export const fundingCallsRoutes: Routes = [
  {
    path: '',
    title: 'fundingCalls.open.title',
    component: OpenFundingCalls,
  },
  {
    path: 'new',
    title: 'fundingCalls.new.title',
    canActivate: [requireAnyRole('PROGRAMME_MANAGER')],
    component: NewFundingCall,
  },
  {
    path: ':fundingCallId',
    title: 'fundingCalls.detail.title',
    component: FundingCallDetail,
  },
];
