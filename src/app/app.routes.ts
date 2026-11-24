import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CurrentUser } from './auth/current-user';
import { requireAnyRole } from './auth/role-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: () => inject(CurrentUser).startPage() },
  {
    path: 'applications',
    canActivate: [requireAnyRole('APPLICANT', 'ASSESSOR', 'DECISION_MAKER')],
    loadChildren: () =>
      import('./applications/applications.routes').then((m) => m.applicationsRoutes),
  },
  {
    path: 'funding-calls',
    canActivate: [requireAnyRole('APPLICANT', 'ASSESSOR', 'DECISION_MAKER', 'PROGRAMME_MANAGER')],
    loadChildren: () =>
      import('./funding-calls/funding-calls.routes').then((m) => m.fundingCallsRoutes),
  },
  {
    path: 'no-access',
    title: $localize`:@@noAccess.title:No access`,
    loadComponent: () => import('./layout/no-access/no-access').then((m) => m.NoAccess),
  },
  {
    path: '**',
    title: $localize`:@@notFound.title:Page not found`,
    loadComponent: () => import('./layout/not-found/not-found').then((m) => m.NotFound),
  },
];
