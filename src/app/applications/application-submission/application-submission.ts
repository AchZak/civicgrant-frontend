import { Component, computed, inject, input, output, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Message } from 'primeng/message';
import { problemFrom } from '../../api/http-problem';
import { codeKey, problemKey } from '../../api/problem-messages';
import { Application, ApplicationsApi } from '../applications-api';

interface ConfirmTexts {
  readonly heading: string;
  readonly message: string;
  readonly accept: string;
  readonly reject: string;
}

@Component({
  imports: [TranslocoDirective, ButtonDirective, ButtonLabel, ConfirmDialog, Message],
  providers: [ConfirmationService],
  selector: 'app-application-submission',
  templateUrl: './application-submission.html',
})
export class ApplicationSubmission {
  readonly application = input.required<Application>();
  readonly unsavedChanges = input(false);
  readonly callOpen = input(true);
  readonly submitted = output();

  private readonly api = inject(ApplicationsApi);
  private readonly confirmation = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly submitting = signal(false);
  protected readonly problemKey = signal<string | undefined>(undefined);

  // Hints only: the backend checks all of this again when the application is submitted.
  protected readonly obstacleKey = computed(() => {
    if (!this.callOpen()) {
      return 'applications.submission.callNotOpen';
    }
    if (this.application().documents.length === 0) {
      return codeKey('supportingDocumentRequired');
    }
    if (this.unsavedChanges()) {
      return 'applications.submission.saveFirst';
    }
    return undefined;
  });

  protected confirmSubmission(): void {
    const texts = this.transloco.translateObject<ConfirmTexts>('applications.submission.confirm');
    this.confirmation.confirm({
      header: texts.heading,
      message: texts.message,
      acceptLabel: texts.accept,
      rejectLabel: texts.reject,
      accept: () => void this.submit(),
    });
  }

  private async submit(): Promise<void> {
    this.problemKey.set(undefined);
    this.submitting.set(true);
    try {
      await this.api.submit(this.application().id);
      this.submitted.emit();
    } catch (error) {
      this.problemKey.set(problemKey(problemFrom(error)));
    } finally {
      this.submitting.set(false);
    }
  }
}
