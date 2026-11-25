import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CurrentUser } from '../../auth/current-user';
import { CurrentLanguage } from '../../language/current-language';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { MoneyPipe } from '../../shared/money-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { openFundingCallsResource } from '../funding-calls-api';

@Component({
  imports: [
    RouterLink,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    TableModule,
    BrusselsDatePipe,
    LoadError,
    LocalizedPipe,
    MoneyPipe,
    PageHeader,
  ],
  selector: 'app-open-funding-calls',
  templateUrl: './open-funding-calls.html',
})
export class OpenFundingCalls {
  protected readonly user = inject(CurrentUser);
  protected readonly calls = openFundingCallsResource();
  protected readonly items = computed(() => this.calls.value()?.items ?? []);
  protected readonly localizedTextLang = inject(CurrentLanguage).localizedTextLang;
  protected readonly introKey = computed(() =>
    this.user.isProgrammeManager() ? 'fundingCalls.open.managerIntro' : 'fundingCalls.open.intro',
  );
}
