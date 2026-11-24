import { Routes } from '@angular/router';
import { MyApplications } from './my-applications/my-applications';

export const applicationsRoutes: Routes = [
  {
    path: '',
    title: $localize`:@@applications.mine.title:My applications`,
    component: MyApplications,
  },
];
