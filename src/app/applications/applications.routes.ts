import { Routes } from '@angular/router';
import { ApplicationDetail } from './application-detail/application-detail';
import { MyApplications } from './my-applications/my-applications';
import { NewApplication } from './new-application/new-application';

export const applicationsRoutes: Routes = [
  {
    path: '',
    title: $localize`:@@applications.mine.title:My applications`,
    component: MyApplications,
  },
  {
    path: 'new',
    title: $localize`:@@applications.new.title:New application`,
    component: NewApplication,
  },
  {
    path: ':applicationId',
    title: $localize`:@@applications.detail.title:Application`,
    component: ApplicationDetail,
  },
];
