import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { CurrentLanguage } from '../../language/current-language';
import { FormErrors } from '../../shared/form-errors/form-errors';
import { FormRow } from '../../shared/form-row/form-row';
import { PageHeader } from '../../shared/page-header/page-header';
import { serverErrors } from '../../shared/server-errors';
import {
  emptyFundingCallOpening,
  fundingCallOpeningFieldOfCode,
  fundingCallOpeningFields,
  fundingCallOpeningSchema,
  openFundingCallRequestOf,
} from '../funding-call-opening';
import { FundingCallsApi } from '../funding-calls-api';

@Component({
  imports: [
    FormField,
    FormRoot,
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    DatePicker,
    InputNumber,
    InputText,
    FormErrors,
    FormRow,
    PageHeader,
  ],
  selector: 'app-new-funding-call',
  templateUrl: './new-funding-call.html',
})
export class NewFundingCall {
  private readonly api = inject(FundingCallsApi);
  private readonly router = inject(Router);

  protected readonly locale = inject(CurrentLanguage).locale;

  protected readonly openingForm = form(
    signal(emptyFundingCallOpening()),
    fundingCallOpeningSchema,
    {
      submission: {
        action: async (fields) => {
          const request = openFundingCallRequestOf(fields().value());
          if (!request) {
            return undefined;
          }
          try {
            const fundingCall = await this.api.open(request);
            await this.router.navigate(['/funding-calls', fundingCall.id]);
            return undefined;
          } catch (error) {
            return serverErrors(
              error,
              fundingCallOpeningFields(fields),
              fundingCallOpeningFieldOfCode,
            );
          }
        },
      },
    },
  );
}
