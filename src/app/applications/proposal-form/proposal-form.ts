import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, LOCALE_ID } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { FormRow } from '../../shared/form-row/form-row';
import { languageOptions, ProposalModel } from '../proposal';

@Component({
  imports: [CurrencyPipe, FormField, InputNumber, InputText, Select, Textarea, FormRow],
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.html',
})
export class ProposalForm {
  readonly fields = input.required<FieldTree<ProposalModel>>();
  readonly capPerApplication = input<number>();

  protected readonly locale = inject(LOCALE_ID);
  protected readonly languages = languageOptions;
}
