import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CurrentUser } from '../../auth/current-user';
import { translatedOptions } from '../../language/translated-options';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { FormRow } from '../../shared/form-row/form-row';
import { LoadError } from '../../shared/load-error/load-error';
import { MoneyPipe } from '../../shared/money-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { applicationStatusKey } from '../application-status';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import { applicationPageResource, ApplicationsQuery, ApplicationStatus } from '../applications-api';

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

// Staff never see drafts, so those are the statuses they can filter on.
const staffStatuses: readonly ApplicationStatus[] = [
  'SUBMITTED',
  'ASSESSED',
  'APPROVED',
  'REJECTED',
];

type StatusChoice = ApplicationStatus | 'ALL';

// One list for everyone, like the API's: applicants see their own, staff every submitted one.
@Component({
  imports: [
    FormField,
    RouterLink,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    Select,
    TableModule,
    BrusselsDatePipe,
    FormRow,
    LoadError,
    MoneyPipe,
    PageHeader,
    ApplicationStatusTag,
  ],
  selector: 'app-application-list',
  templateUrl: './application-list.html',
})
export class ApplicationList {
  readonly status = input<string>();

  private readonly router = inject(Router);

  protected readonly user = inject(CurrentUser);
  protected readonly pageSize = pageSize;

  private readonly statusFilter = computed(() =>
    staffStatuses.find((status) => status === this.status()),
  );
  private readonly query = linkedSignal<ApplicationsQuery>(() => ({
    page: 1,
    pageSize,
    status: this.statusFilter(),
  }));

  protected readonly applications = applicationPageResource(this.query);
  protected readonly items = computed(() => this.applications.value()?.items ?? []);
  protected readonly total = computed(() => this.applications.value()?.total ?? 0);
  protected readonly first = computed(() => (this.query().page - 1) * this.query().pageSize);
  protected readonly texts = computed(() => (this.user.isStaff() ? staffTexts : applicantTexts));

  protected readonly filter = form(
    linkedSignal(() => ({ status: (this.statusFilter() ?? 'ALL') as StatusChoice })),
  );
  protected readonly statusOptions = translatedOptions<StatusChoice>(
    ['ALL', ...staffStatuses],
    (choice) => (choice === 'ALL' ? 'applications.list.filter.all' : applicationStatusKey(choice)),
  );

  protected filterBy(choice: StatusChoice): void {
    void this.router.navigate([], {
      queryParams: { status: choice === 'ALL' ? null : choice },
      queryParamsHandling: 'merge',
    });
  }

  protected showPage(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? pageSize;
    this.query.update((query) => ({
      ...query,
      page: Math.floor((event.first ?? 0) / rows) + 1,
      pageSize: rows,
    }));
  }
}
