import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', children: [] },
  {
    path: '**',
    title: $localize`:@@notFound.title:Page not found`,
    loadComponent: () => import('./layout/not-found/not-found').then((m) => m.NotFound),
  },
];
