import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CurrentUser } from '../auth/current-user';
import { requireAnyRole } from '../auth/role-guard';
import { ApplicationDetail } from './application-detail/application-detail';
import { ApplicationList } from './application-list/application-list';
import { NewApplication } from './new-application/new-application';

export const applicationsRoutes: Routes = [
  {
    path: '',
    title: () =>
      inject(CurrentUser).isStaff()
        ? 'applications.list.all.title'
        : 'applications.list.mine.title',
    component: ApplicationList,
  },
  {
    path: 'new',
    title: 'applications.new.title',
    canActivate: [requireAnyRole('APPLICANT')],
    component: NewApplication,
  },
  {
    path: ':applicationId',
    title: 'applications.detail.title',
    component: ApplicationDetail,
  },
];
