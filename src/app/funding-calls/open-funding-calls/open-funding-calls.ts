import { CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { openFundingCallsResource } from '../funding-calls-api';

@Component({
  imports: [
    CurrencyPipe,
    RouterLink,
    TableModule,
    BrusselsDatePipe,
    LoadError,
    LocalizedPipe,
    PageHeader,
  ],
  selector: 'app-open-funding-calls',
  templateUrl: './open-funding-calls.html',
})
export class OpenFundingCalls {
  protected readonly calls = openFundingCallsResource();
  protected readonly items = computed(() => this.calls.value()?.items ?? []);
}
