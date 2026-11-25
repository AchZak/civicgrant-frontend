import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { problemFrom } from '../../api/http-problem';
import { CurrentUser } from '../../auth/current-user';
import { fundingCallResource } from '../../funding-calls/funding-calls-api';
import { acceptsApplications } from '../../funding-calls/submission-period';
import { CurrentLanguage } from '../../language/current-language';
import { organisationResource } from '../../organisations/organisations-api';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { FormErrors } from '../../shared/form-errors/form-errors';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { MoneyPipe } from '../../shared/money-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { serverErrors } from '../../shared/server-errors';
import { ApplicationAssessment } from '../application-assessment/application-assessment';
import { ApplicationDecision } from '../application-decision/application-decision';
import { ApplicationStatusTag } from '../application-status-tag/application-status-tag';
import {
  applicationResource,
  ApplicationsApi,
  ApplicationStatus,
  assessmentResource,
} from '../applications-api';
import { ApplicationDocuments } from '../application-documents/application-documents';
import { ApplicationSubmission } from '../application-submission/application-submission';
import {
  emptyProposal,
  languageKey,
  proposalFieldOfCode,
  proposalFields,
  proposalModelOf,
  proposalOf,
  proposalSchema,
} from '../proposal';
import { ProposalForm } from '../proposal-form/proposal-form';

const assessedStatuses: readonly ApplicationStatus[] = ['ASSESSED', 'APPROVED', 'REJECTED'];

@Component({
  imports: [
    FormRoot,
    RouterLink,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    Message,
    Skeleton,
    BrusselsDatePipe,
    Detail,
    FormErrors,
    LoadError,
    LocalizedPipe,
    MoneyPipe,
    PageHeader,
    ApplicationStatusTag,
    ApplicationAssessment,
    ApplicationDecision,
    ApplicationDocuments,
    ApplicationSubmission,
    ProposalForm,
  ],
  selector: 'app-application-detail',
  templateUrl: './application-detail.html',
})
export class ApplicationDetail {
  readonly applicationId = input.required<string>();

  private readonly api = inject(ApplicationsApi);
  private readonly user = inject(CurrentUser);

  protected readonly application = applicationResource(this.applicationId);
  protected readonly fundingCall = fundingCallResource(
    () => this.application.value()?.fundingCallId,
  );
  protected readonly organisation = organisationResource(
    () => this.application.value()?.organisationId,
  );
  private readonly status = computed(() => this.application.value()?.status);
  private readonly assessed = computed(() => {
    const status = this.status();
    return status !== undefined && assessedStatuses.includes(status);
  });

  // Applicants never see the assessment; the API refuses it to them.
  protected readonly assessment = assessmentResource(() =>
    this.user.isStaff() && this.assessed() ? this.applicationId() : undefined,
  );
  protected readonly showsAssessment = computed(
    () =>
      (this.user.isStaff() && this.assessed()) ||
      (this.user.isAssessor() && this.status() === 'SUBMITTED'),
  );
  protected readonly showsDecision = computed(
    () =>
      this.status() === 'APPROVED' ||
      this.status() === 'REJECTED' ||
      (this.user.isDecisionMaker() && this.status() === 'ASSESSED'),
  );

  protected readonly isDraft = computed(() => this.status() === 'DRAFT');
  protected readonly cap = computed(() => this.fundingCall.value()?.maxAmountPerApplication);
  protected readonly callOpen = computed(() => {
    const call = this.fundingCall.value();
    return call === undefined || acceptsApplications(call);
  });
  protected readonly saved = signal(false);
  protected readonly concurrentUpdate = signal(false);
  protected readonly justSubmitted = signal(false);

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

  protected readonly localizedTextLang = inject(CurrentLanguage).localizedTextLang;
  protected readonly languageKey = languageKey;

  protected onSubmitted(): void {
    this.justSubmitted.set(true);
    this.application.reload();
  }

  // An approval takes the grant from the call's budget, so its remaining budget changes too.
  protected onDecided(): void {
    this.application.reload();
    this.fundingCall.reload();
  }

  protected reload(): void {
    this.concurrentUpdate.set(false);
    this.proposalForm().reset();
    this.application.reload();
  }
}
