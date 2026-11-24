import { Component, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { CurrentLanguage } from '../../language/current-language';
import { translatedOptions } from '../../language/translated-options';
import { FormRow } from '../../shared/form-row/form-row';
import { MoneyPipe } from '../../shared/money-pipe';
import { languageKey, languages, ProposalModel } from '../proposal';

@Component({
  imports: [
    FormField,
    TranslocoDirective,
    InputNumber,
    InputText,
    Select,
    Textarea,
    FormRow,
    MoneyPipe,
  ],
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.html',
})
export class ProposalForm {
  readonly fields = input.required<FieldTree<ProposalModel>>();
  readonly capPerApplication = input<number>();

  protected readonly locale = inject(CurrentLanguage).locale;
  protected readonly languages = translatedOptions(languages, languageKey);
}
