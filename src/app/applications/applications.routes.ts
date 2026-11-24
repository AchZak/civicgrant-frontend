import { Routes } from '@angular/router';
import { ApplicationDetail } from './application-detail/application-detail';
import { MyApplications } from './my-applications/my-applications';

export const applicationsRoutes: Routes = [
  {
    path: '',
    title: $localize`:@@applications.mine.title:My applications`,
    component: MyApplications,
  },
  {
    path: ':applicationId',
    title: $localize`:@@applications.detail.title:Application`,
    component: ApplicationDetail,
  },
];
