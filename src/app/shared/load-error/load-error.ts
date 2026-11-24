import { Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Message } from 'primeng/message';
import { problemFrom } from '../../api/http-problem';
import { problemKey } from '../../api/problem-messages';
import { NotFound } from '../../layout/not-found/not-found';

@Component({
  imports: [TranslocoDirective, Message, NotFound],
  selector: 'app-load-error',
  templateUrl: './load-error.html',
})
export class LoadError {
  readonly error = input.required<unknown>();

  protected readonly problem = computed(() => problemFrom(this.error()));
  protected readonly messageKey = computed(() => problemKey(this.problem()));
}
