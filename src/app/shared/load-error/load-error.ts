import { Component, computed, input } from '@angular/core';
import { Message } from 'primeng/message';
import { problemFrom } from '../../api/http-problem';
import { problemMessage } from '../../api/problem-messages';
import { NotFound } from '../../layout/not-found/not-found';

@Component({
  imports: [Message, NotFound],
  selector: 'app-load-error',
  templateUrl: './load-error.html',
})
export class LoadError {
  readonly error = input.required<unknown>();

  protected readonly problem = computed(() => problemFrom(this.error()));
  protected readonly message = computed(() => problemMessage(this.problem()));
}
