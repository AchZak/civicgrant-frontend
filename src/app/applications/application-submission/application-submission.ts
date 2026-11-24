import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Message } from 'primeng/message';
import { problemFrom } from '../../api/http-problem';
import { codeMessage, problemMessage } from '../../api/problem-messages';
import { Application, ApplicationsApi } from '../applications-api';

@Component({
  imports: [ButtonDirective, ButtonLabel, ConfirmDialog, Message],
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

  protected readonly submitting = signal(false);
  protected readonly problem = signal<string | undefined>(undefined);

  // Hints only: the backend checks all of this again when the application is submitted.
  protected readonly obstacle = computed(() => {
    if (!this.callOpen()) {
      return $localize`:@@applications.submit.callNotOpen:This funding call doesn't accept applications right now.`;
    }
    if (this.application().documents.length === 0) {
      return codeMessage('supportingDocumentRequired');
    }
    if (this.unsavedChanges()) {
      return $localize`:@@applications.submit.saveFirst:Save your changes before you submit.`;
    }
    return undefined;
  });

  protected confirmSubmission(): void {
    this.confirmation.confirm({
      header: $localize`:@@applications.submit.confirmHeader:Submit the application?`,
      message: $localize`:@@applications.submit.confirmMessage:Once it's submitted, you can no longer change the application or its documents.`,
      acceptLabel: $localize`:@@applications.submit.confirm:Submit`,
      rejectLabel: $localize`:@@applications.submit.cancel:Not yet`,
      accept: () => void this.submit(),
    });
  }

  private async submit(): Promise<void> {
    this.problem.set(undefined);
    this.submitting.set(true);
    try {
      await this.api.submit(this.application().id);
      this.submitted.emit();
    } catch (error) {
      this.problem.set(problemMessage(problemFrom(error)));
    } finally {
      this.submitting.set(false);
    }
  }
}
