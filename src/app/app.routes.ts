import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'applications' },
  {
    path: 'applications',
    loadChildren: () =>
      import('./applications/applications.routes').then((m) => m.applicationsRoutes),
  },
  {
    path: 'funding-calls',
    loadChildren: () =>
      import('./funding-calls/funding-calls.routes').then((m) => m.fundingCallsRoutes),
  },
  {
    path: '**',
    title: $localize`:@@notFound.title:Page not found`,
    loadComponent: () => import('./layout/not-found/not-found').then((m) => m.NotFound),
  },
];
