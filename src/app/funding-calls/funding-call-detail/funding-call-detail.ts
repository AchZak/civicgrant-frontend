import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { fundingCallResource } from '../funding-calls-api';
import { acceptsApplications } from '../submission-period';

@Component({
  imports: [
    CurrencyPipe,
    ButtonDirective,
    ButtonLabel,
    Message,
    Skeleton,
    BrusselsDatePipe,
    Detail,
    LoadError,
    LocalizedPipe,
    PageHeader,
  ],
  selector: 'app-funding-call-detail',
  templateUrl: './funding-call-detail.html',
})
export class FundingCallDetail {
  readonly fundingCallId = input.required<string>();

  protected readonly call = fundingCallResource(this.fundingCallId);

  private readonly router = inject(Router);

  protected readonly acceptsApplications = computed(() => {
    const call = this.call.value();
    return call !== undefined && acceptsApplications(call);
  });

  protected apply(fundingCallId: string): void {
    void this.router.navigate(['/applications/new'], { queryParams: { fundingCallId } });
  }
}
