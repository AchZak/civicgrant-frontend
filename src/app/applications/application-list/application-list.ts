import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CurrentUser } from '../../auth/current-user';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { LoadError } from '../../shared/load-error/load-error';
import { MoneyPipe } from '../../shared/money-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import { applicationPageResource, ApplicationsQuery } from '../applications-api';

const pageSize = 20;

const applicantTexts = {
  heading: 'applications.list.mine.heading',
  intro: 'applications.list.mine.intro',
  empty: 'applications.list.mine.empty',
};

const staffTexts = {
  heading: 'applications.list.all.heading',
  intro: 'applications.list.all.intro',
  empty: 'applications.list.all.empty',
};

// One list for everyone, like the API's: applicants see their own, staff every submitted one.
@Component({
  imports: [
    RouterLink,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    TableModule,
    BrusselsDatePipe,
    LoadError,
    MoneyPipe,
    PageHeader,
    ApplicationStatusTag,
  ],
  selector: 'app-application-list',
  templateUrl: './application-list.html',
})
export class ApplicationList {
  protected readonly user = inject(CurrentUser);
  protected readonly pageSize = pageSize;
  private readonly query = signal<ApplicationsQuery>({ page: 1, pageSize });

  protected readonly applications = applicationPageResource(this.query);
  protected readonly items = computed(() => this.applications.value()?.items ?? []);
  protected readonly total = computed(() => this.applications.value()?.total ?? 0);
  protected readonly texts = computed(() => (this.user.isStaff() ? staffTexts : applicantTexts));

  protected showPage(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? pageSize;
    this.query.set({ page: Math.floor((event.first ?? 0) / rows) + 1, pageSize: rows });
  }
}
