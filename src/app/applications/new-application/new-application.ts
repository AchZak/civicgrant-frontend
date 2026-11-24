import { Component, computed, inject, input, signal } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { fundingCallResource } from '../../funding-calls/funding-calls-api';
import { OrganisationPicker } from '../../organisations/organisation-picker/organisation-picker';
import { Organisation } from '../../organisations/organisations-api';
import { FieldErrors } from '../../shared/field-errors/field-errors';
import { LoadError } from '../../shared/load-error/load-error';
import { LocalizedPipe } from '../../shared/localized-pipe';
import { PageHeader } from '../../shared/page-header/page-header';
import { serverErrors } from '../../shared/server-errors';
import { ApplicationsApi } from '../applications-api';
import {
  emptyProposal,
  proposalFieldOfCode,
  proposalFields,
  proposalOf,
  proposalSchema,
} from '../proposal';
import { ProposalForm } from '../proposal-form/proposal-form';

@Component({
  imports: [
    FormRoot,
    RouterLink,
    ButtonDirective,
    ButtonLabel,
    Skeleton,
    OrganisationPicker,
    FieldErrors,
    LoadError,
    LocalizedPipe,
    PageHeader,
    ProposalForm,
  ],
  selector: 'app-new-application',
  templateUrl: './new-application.html',
})
export class NewApplication {
  readonly fundingCallId = input<string>();

  private readonly api = inject(ApplicationsApi);
  private readonly router = inject(Router);

  protected readonly call = fundingCallResource(this.fundingCallId);
  protected readonly organisation = signal<Organisation | undefined>(undefined);
  private readonly cap = computed(() => this.call.value()?.maxAmountPerApplication);

  protected readonly draftForm = form(signal(emptyProposal()), proposalSchema(this.cap), {
    submission: {
      action: async (fields) => {
        const proposal = proposalOf(fields().value());
        const fundingCallId = this.fundingCallId();
        const organisationId = this.organisation()?.id;
        if (!proposal || !fundingCallId || !organisationId) {
          return undefined;
        }
        try {
          const application = await this.api.create({ fundingCallId, organisationId, proposal });
          await this.router.navigate(['/applications', application.id]);
          return undefined;
        } catch (error) {
          return serverErrors(
            error,
            proposalFields(fields, 'proposal.'),
            proposalFieldOfCode('proposal.'),
          );
        }
      },
    },
  });
}
