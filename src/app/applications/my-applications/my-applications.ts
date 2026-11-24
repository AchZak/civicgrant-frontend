import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { LoadError } from '../../shared/load-error/load-error';
import { PageHeader } from '../../shared/page-header/page-header';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import { applicationPageResource, ApplicationsQuery } from '../applications-api';

const pageSize = 20;

@Component({
  imports: [
    CurrencyPipe,
    RouterLink,
    ButtonDirective,
    ButtonLabel,
    TableModule,
    BrusselsDatePipe,
    LoadError,
    PageHeader,
    ApplicationStatusTag,
  ],
  selector: 'app-my-applications',
  templateUrl: './my-applications.html',
})
export class MyApplications {
  protected readonly pageSize = pageSize;
  private readonly query = signal<ApplicationsQuery>({ page: 1, pageSize });

  protected readonly applications = applicationPageResource(this.query);
  protected readonly items = computed(() => this.applications.value()?.items ?? []);
  protected readonly total = computed(() => this.applications.value()?.total ?? 0);

  protected showPage(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? pageSize;
    this.query.set({ page: Math.floor((event.first ?? 0) / rows) + 1, pageSize: rows });
  }
}
