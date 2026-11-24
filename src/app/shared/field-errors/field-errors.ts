import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { Message } from 'primeng/message';

@Component({
  imports: [Message],
  selector: 'app-field-errors',
  templateUrl: './field-errors.html',
})
export class FieldErrors {
  readonly errors = input.required<readonly ValidationError[]>();
}
