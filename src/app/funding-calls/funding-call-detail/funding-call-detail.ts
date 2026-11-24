import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { fundingCallResource } from '../funding-calls-api';

@Component({
  imports: [CurrencyPipe, Skeleton, BrusselsDatePipe, Detail, LoadError, LocalizedPipe, PageHeader],
  selector: 'app-funding-call-detail',
  templateUrl: './funding-call-detail.html',
})
export class FundingCallDetail {
  readonly fundingCallId = input.required<string>();

  protected readonly call = fundingCallResource(this.fundingCallId);
}
