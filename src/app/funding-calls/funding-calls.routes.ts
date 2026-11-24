import { Routes } from '@angular/router';
import { OpenFundingCalls } from './open-funding-calls/open-funding-calls';

export const fundingCallsRoutes: Routes = [
  {
    path: '',
    title: $localize`:@@fundingCalls.open.title:Open funding calls`,
    component: OpenFundingCalls,
  },
];
