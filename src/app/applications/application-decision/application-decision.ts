import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { problemFrom } from '../../api/http-problem';
import { CurrentUser } from '../../auth/current-user';
import { CurrentLanguage } from '../../language/current-language';
import { translatedOptions } from '../../language/translated-options';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { FieldErrors } from '../../shared/field-errors/field-errors';
import { FormErrors } from '../../shared/form-errors/form-errors';
import { FormRow } from '../../shared/form-row/form-row';
import { MoneyPipe } from '../../shared/money-pipe';
import { serverErrors } from '../../shared/server-errors';
import { Application, ApplicationsApi, decisionResource } from '../applications-api';
import { confirmTexts } from '../confirm-texts';
import {
  decisionFieldOfCode,
  decisionFields,
  decisionRequestOf,
  decisionSchema,
  emptyDecision,
  outcomeKey,
  outcomes,
} from '../decision';
import { rejectionGroundKey, rejectionGrounds } from '../rejection-ground';

// Everyone reads the decision; a decision maker takes it while the application is assessed.
@Component({
  imports: [
    FormField,
    FormRoot,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    ConfirmDialog,
    InputNumber,
    RadioButton,
    Select,
    Textarea,
    BrusselsDatePipe,
    Detail,
    FieldErrors,
    FormErrors,
    FormRow,
    MoneyPipe,
  ],
  providers: [ConfirmationService],
  selector: 'app-application-decision',
  templateUrl: './application-decision.html',
})
export class ApplicationDecision {
  readonly application = input.required<Application>();
  readonly proposedAmount = input<number>();
  readonly remainingBudget = input<number>();
  readonly changed = output();

  private readonly api = inject(ApplicationsApi);
  private readonly user = inject(CurrentUser);
  private readonly confirmation = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly decision = decisionResource(() => {
    const { id, status } = this.application();
    return status === 'APPROVED' || status === 'REJECTED' ? id : undefined;
  });

  protected readonly locale = inject(CurrentLanguage).locale;
  protected readonly outcomes = outcomes;
  protected readonly outcomeKey = outcomeKey;
  protected readonly rejectionGroundKey = rejectionGroundKey;
  protected readonly rejectionGrounds = translatedOptions(rejectionGrounds, rejectionGroundKey);
  protected readonly canDecide = computed(
    () => this.user.isDecisionMaker() && this.application().status === 'ASSESSED',
  );
  protected readonly conflict = signal(false);

  protected readonly decisionForm = form(
    linkedSignal(() => emptyDecision(this.proposedAmount())),
    decisionSchema(() => this.application().proposal.requestedAmount),
    {
      submission: {
        action: async (fields) => {
          const request = decisionRequestOf(fields().value());
          if (!request || !(await this.confirmed())) {
            return undefined;
          }
          this.conflict.set(false);
          try {
            await this.api.decide(this.application().id, request);
            this.changed.emit();
            return undefined;
          } catch (error) {
            this.conflict.set(problemFrom(error).status === 409);
            return serverErrors(error, decisionFields(fields), decisionFieldOfCode);
          }
        },
      },
    },
  );

  protected reload(): void {
    this.conflict.set(false);
    this.changed.emit();
  }

  // A decision is final, so it's confirmed first; closing the dialog counts as "not yet".
  private confirmed(): Promise<boolean> {
    return new Promise((resolve) =>
      this.confirmation.confirm({
        ...confirmTexts(this.transloco, 'applications.decision.confirm'),
        accept: () => resolve(true),
        reject: () => resolve(false),
      }),
    );
  }
}
