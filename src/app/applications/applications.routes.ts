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
        ? $localize`:@@applications.all.title:Applications`
        : $localize`:@@applications.mine.title:My applications`,
    component: ApplicationList,
  },
  {
    path: 'new',
    title: $localize`:@@applications.new.title:New application`,
    canActivate: [requireAnyRole('APPLICANT')],
    component: NewApplication,
  },
  {
    path: ':applicationId',
    title: $localize`:@@applications.detail.title:Application`,
    component: ApplicationDetail,
  },
];
