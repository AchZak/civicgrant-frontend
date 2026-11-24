import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { fundingCallResource } from '../../funding-calls/funding-calls-api';
import { organisationResource } from '../../organisations/organisations-api';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import { applicationResource, decisionResource } from '../applications-api';
import { FileSizePipe } from '../file-size-pipe';
import { languageLabel } from '../proposal';
import { rejectionGroundLabel } from '../rejection-ground';

@Component({
  imports: [
    CurrencyPipe,
    RouterLink,
    Skeleton,
    BrusselsDatePipe,
    Detail,
    LoadError,
    LocalizedPipe,
    PageHeader,
    ApplicationStatusTag,
    FileSizePipe,
  ],
  selector: 'app-application-detail',
  templateUrl: './application-detail.html',
})
export class ApplicationDetail {
  readonly applicationId = input.required<string>();

  protected readonly application = applicationResource(this.applicationId);
  protected readonly fundingCall = fundingCallResource(
    () => this.application.value()?.fundingCallId,
  );
  protected readonly organisation = organisationResource(
    () => this.application.value()?.organisationId,
  );
  protected readonly decision = decisionResource(() => {
    const status = this.application.value()?.status;
    return status === 'APPROVED' || status === 'REJECTED' ? this.applicationId() : undefined;
  });

  protected readonly languageLabel = languageLabel;
  protected readonly rejectionGroundLabel = rejectionGroundLabel;
}
