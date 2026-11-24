import { Component, inject, input, output, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { problemFrom } from '../../api/http-problem';
import { problemKey } from '../../api/problem-messages';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Application, ApplicationsApi, SupportingDocument } from '../applications-api';
import { FileSizePipe } from '../file-size-pipe';
import { saveFile } from '../save-file';

const tenMegabytes = 10 * 1024 * 1024;

@Component({
  imports: [
    TranslocoDirective,
    ButtonDirective,
    ButtonLabel,
    FileUpload,
    Message,
    ProgressBar,
    BrusselsDatePipe,
    FileSizePipe,
  ],
  selector: 'app-application-documents',
  templateUrl: './application-documents.html',
})
export class ApplicationDocuments {
  readonly application = input.required<Application>();
  readonly editable = input(false);
  readonly changed = output();

  private readonly api = inject(ApplicationsApi);

  protected readonly maxFileSize = tenMegabytes;
  protected readonly progress = signal<number | undefined>(undefined);
  protected readonly problemKey = signal<string | undefined>(undefined);

  protected async attach(event: FileUploadHandlerEvent, uploader: FileUpload): Promise<void> {
    const file = event.files[0];
    uploader.clear();
    if (file === undefined) {
      return;
    }
    this.problemKey.set(undefined);
    this.progress.set(0);
    try {
      await this.api.attachDocument(this.application().id, file, (percent) =>
        this.progress.set(percent),
      );
      this.changed.emit();
    } catch (error) {
      this.problemKey.set(problemKey(problemFrom(error)));
    } finally {
      this.progress.set(undefined);
    }
  }

  protected async remove(document: SupportingDocument): Promise<void> {
    this.problemKey.set(undefined);
    try {
      await this.api.removeDocument(this.application().id, document.id);
      this.changed.emit();
    } catch (error) {
      this.problemKey.set(problemKey(problemFrom(error)));
    }
  }

  protected async download(document: SupportingDocument): Promise<void> {
    this.problemKey.set(undefined);
    try {
      saveFile(
        await this.api.downloadDocument(this.application().id, document.id),
        document.fileName,
      );
    } catch (error) {
      this.problemKey.set(problemKey(problemFrom(error)));
    }
  }
}
