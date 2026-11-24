import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { FieldErrors } from '../field-errors/field-errors';

// The control is described by `${controlId}-hint` and `${controlId}-errors`; a PrimeNG Select
// is a span, which `for` can't name, so it takes ariaLabelledBy="${controlId}-label".
@Component({
  imports: [FieldErrors],
  selector: 'app-form-row',
  templateUrl: './form-row.html',
})
export class FormRow {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly hint = input<string>();
  readonly errors = input.required<readonly ValidationError[]>();
}
