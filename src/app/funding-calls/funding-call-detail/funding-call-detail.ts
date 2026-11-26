import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { CurrentUser } from '../../auth/current-user';
import { CurrentLanguage } from '../../language/current-language';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { MoneyPipe } from '../../shared/money-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { fundingCallResource } from '../funding-calls-api';
import { LastDayPipe } from '../last-day-pipe';
import { acceptsApplications } from '../submission-period';

@Component({
  imports: [
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    Message,
    Skeleton,
    BrusselsDatePipe,
    Detail,
    LastDayPipe,
    LoadError,
    LocalizedPipe,
    MoneyPipe,
    PageHeader,
  ],
  selector: 'app-funding-call-detail',
  templateUrl: './funding-call-detail.html',
})
export class FundingCallDetail {
  readonly fundingCallId = input.required<string>();

  protected readonly user = inject(CurrentUser);
  protected readonly call = fundingCallResource(this.fundingCallId);
  protected readonly localizedTextLang = inject(CurrentLanguage).localizedTextLang;

  private readonly router = inject(Router);

  protected readonly acceptsApplications = computed(() => {
    const call = this.call.value();
    return call !== undefined && acceptsApplications(call);
  });

  protected apply(fundingCallId: string): void {
    void this.router.navigate(['/applications/new'], { queryParams: { fundingCallId } });
  }
}
