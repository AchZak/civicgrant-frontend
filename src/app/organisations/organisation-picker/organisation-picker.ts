import { Component, inject, model, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { codeMessage } from '../../api/problem-messages';
import { FieldErrors } from '../../shared/field-errors/field-errors';
import { onceTouched, serverErrors } from '../../shared/server-errors';
import { formatEnterpriseNumber, parseEnterpriseNumber } from '../enterprise-number';
import { legalFormLabel, legalFormOptions } from '../legal-form';
import { LegalForm, Organisation, OrganisationsApi } from '../organisations-api';

const enterpriseNumberCodes = {
  enterpriseNumberInvalidFormat: 'enterpriseNumber',
  enterpriseNumberInvalidChecksum: 'enterpriseNumber',
};

@Component({
  imports: [
    FormField,
    FormRoot,
    ButtonDirective,
    ButtonLabel,
    InputText,
    Message,
    Select,
    FieldErrors,
  ],
  selector: 'app-organisation-picker',
  templateUrl: './organisation-picker.html',
})
export class OrganisationPicker {
  readonly organisation = model<Organisation>();

  private readonly api = inject(OrganisationsApi);

  protected readonly legalForms = legalFormOptions;
  protected readonly legalFormLabel = legalFormLabel;
  protected readonly format = formatEnterpriseNumber;
  protected readonly unregisteredNumber = signal<string | undefined>(undefined);

  protected readonly lookupForm = form(
    signal({ enterpriseNumber: '' }),
    (path) => {
      required(path.enterpriseNumber, {
        when: onceTouched,
        message: $localize`:@@organisations.enterpriseNumber.required:Enter the enterprise number.`,
      });
    },
    {
      submission: {
        action: async (fields) => {
          const enterpriseNumber = parseEnterpriseNumber(fields.enterpriseNumber().value());
          if (enterpriseNumber === undefined) {
            return {
              kind: 'format',
              message: codeMessage('enterpriseNumberInvalidFormat'),
              fieldTree: fields.enterpriseNumber,
            };
          }
          try {
            const found = await this.api.find(enterpriseNumber);
            this.unregisteredNumber.set(found ? undefined : enterpriseNumber);
            this.organisation.set(found);
            return undefined;
          } catch (error) {
            return serverErrors(
              error,
              { enterpriseNumber: fields.enterpriseNumber },
              enterpriseNumberCodes,
            );
          }
        },
      },
    },
  );

  protected readonly registerForm = form(
    signal<{ name: string; legalForm: LegalForm | null }>({ name: '', legalForm: null }),
    (path) => {
      required(path.name, {
        when: onceTouched,
        message: codeMessage('organisationNameRequired'),
      });
      maxLength(path.name, 200, { message: codeMessage('organisationNameTooLong') });
      required(path.legalForm, {
        when: onceTouched,
        message: $localize`:@@organisations.legalForm.required:Choose the legal form.`,
      });
    },
    {
      submission: {
        action: async (fields) => {
          const { name, legalForm } = fields().value();
          const enterpriseNumber = this.unregisteredNumber();
          if (legalForm === null || enterpriseNumber === undefined) {
            return undefined;
          }
          try {
            this.organisation.set(await this.api.register({ enterpriseNumber, name, legalForm }));
            this.unregisteredNumber.set(undefined);
            return undefined;
          } catch (error) {
            return serverErrors(
              error,
              { name: fields.name, legalForm: fields.legalForm },
              {
                organisationNameRequired: 'name',
                organisationNameTooLong: 'name',
              },
            );
          }
        },
      },
    },
  );

  protected chooseAnother(): void {
    this.organisation.set(undefined);
    this.unregisteredNumber.set(undefined);
  }
}
