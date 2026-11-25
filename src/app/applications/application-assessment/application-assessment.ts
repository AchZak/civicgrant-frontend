import { HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { problemFrom } from '../../api/http-problem';
import { CurrentUser } from '../../auth/current-user';
import { CurrentLanguage } from '../../language/current-language';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Detail } from '../../shared/detail/detail';
import { FieldErrors } from '../../shared/field-errors/field-errors';
import { FormErrors } from '../../shared/form-errors/form-errors';
import { FormRow } from '../../shared/form-row/form-row';
import { LoadError } from '../../shared/load-error/load-error';
import { MoneyPipe } from '../../shared/money-pipe';
import { serverErrors } from '../../shared/server-errors';
import { Application, ApplicationsApi, Assessment } from '../applications-api';
import {
  assessmentFieldOfCode,
  assessmentFields,
  assessmentRequestOf,
  assessmentSchema,
  emptyAssessment,
  recommendationKey,
  recommendations,
} from '../assessment';

const answers = [
  { value: true, key: 'common.answers.yes' },
  { value: false, key: 'common.answers.no' },
] as const;

// Staff read the assessment; an assessor records it while the application is submitted.
@Component({
  imports: [
    FormField,
    FormRoot,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    InputNumber,
    RadioButton,
    Textarea,
    BrusselsDatePipe,
    Detail,
    FieldErrors,
    FormErrors,
    FormRow,
    LoadError,
    MoneyPipe,
  ],
  selector: 'app-application-assessment',
  templateUrl: './application-assessment.html',
})
export class ApplicationAssessment {
  readonly application = input.required<Application>();
  readonly assessment = input.required<HttpResourceRef<Assessment | undefined>>();
  readonly changed = output();

  private readonly api = inject(ApplicationsApi);
  private readonly user = inject(CurrentUser);

  protected readonly locale = inject(CurrentLanguage).locale;
  protected readonly answers = answers;
  protected readonly recommendations = recommendations;
  protected readonly recommendationKey = recommendationKey;
  protected readonly canAssess = computed(
    () => this.user.isAssessor() && this.application().status === 'SUBMITTED',
  );
  protected readonly conflict = signal(false);

  protected readonly assessmentForm = form(
    signal(emptyAssessment()),
    assessmentSchema(() => this.application().proposal.requestedAmount),
    {
      submission: {
        action: async (fields) => {
          const request = assessmentRequestOf(fields().value());
          if (!request) {
            return undefined;
          }
          this.conflict.set(false);
          try {
            await this.api.recordAssessment(this.application().id, request);
            this.changed.emit();
            return undefined;
          } catch (error) {
            this.conflict.set(problemFrom(error).status === 409);
            return serverErrors(error, assessmentFields(fields), assessmentFieldOfCode);
          }
        },
      },
    },
  );

  protected reload(): void {
    this.conflict.set(false);
    this.changed.emit();
  }
}
