import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { Message } from 'primeng/message';

@Component({
  imports: [TranslocoDirective, Message],
  selector: 'app-form-errors',
  templateUrl: './form-errors.html',
})
export class FormErrors {
  readonly errors = input.required<readonly ValidationError[]>();
}
