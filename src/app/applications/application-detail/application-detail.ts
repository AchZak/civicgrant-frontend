import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { problemFrom } from '../../api/http-problem';
import { fundingCallResource } from '../../funding-calls/funding-calls-api';
import { organisationResource } from '../../organisations/organisations-api';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { FormErrors } from '../../shared/form-errors/form-errors';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { serverErrors } from '../../shared/server-errors';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import { applicationResource, ApplicationsApi, decisionResource } from '../applications-api';
import { FileSizePipe } from '../file-size-pipe';
import {
  emptyProposal,
  languageLabel,
  proposalFieldOfCode,
  proposalFields,
  proposalModelOf,
  proposalOf,
  proposalSchema,
} from '../proposal';
import { ProposalForm } from '../proposal-form/proposal-form';
import { rejectionGroundLabel } from '../rejection-ground';

@Component({
  imports: [
    CurrencyPipe,
    FormRoot,
    RouterLink,
    ButtonDirective,
    ButtonLabel,
    Skeleton,
    BrusselsDatePipe,
    Detail,
    FormErrors,
    LoadError,
    LocalizedPipe,
    PageHeader,
    ApplicationStatusTag,
    FileSizePipe,
    ProposalForm,
  ],
  selector: 'app-application-detail',
  templateUrl: './application-detail.html',
})
export class ApplicationDetail {
  readonly applicationId = input.required<string>();

  private readonly api = inject(ApplicationsApi);

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

  protected readonly isDraft = computed(() => this.application.value()?.status === 'DRAFT');
  protected readonly cap = computed(() => this.fundingCall.value()?.maxAmountPerApplication);
  protected readonly saved = signal(false);
  protected readonly concurrentUpdate = signal(false);

  private readonly proposal = linkedSignal(() => {
    const application = this.application.value();
    return application ? proposalModelOf(application.proposal) : emptyProposal();
  });

  protected readonly proposalForm = form(this.proposal, proposalSchema(this.cap), {
    submission: {
      action: async (fields) => {
        const proposal = proposalOf(fields().value());
        if (!proposal) {
          return undefined;
        }
        this.saved.set(false);
        this.concurrentUpdate.set(false);
        try {
          await this.api.editProposal(this.applicationId(), proposal);
          fields().reset();
          this.application.reload();
          this.saved.set(true);
          return undefined;
        } catch (error) {
          this.concurrentUpdate.set(problemFrom(error).code === 'concurrentUpdate');
          return serverErrors(error, proposalFields(fields), proposalFieldOfCode());
        }
      },
    },
  });

  protected readonly languageLabel = languageLabel;
  protected readonly rejectionGroundLabel = rejectionGroundLabel;

  protected reload(): void {
    this.concurrentUpdate.set(false);
    this.proposalForm().reset();
    this.application.reload();
  }
}
