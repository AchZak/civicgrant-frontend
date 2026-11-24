import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { problemFrom } from '../../api/http-problem';
import { problemMessage } from '../../api/problem-messages';
import { BrusselsDatePipe } from '../../shared/brussels-date-pipe';
import { Application, ApplicationsApi, SupportingDocument } from '../applications-api';
import { FileSizePipe } from '../file-size-pipe';
import { saveFile } from '../save-file';

const tenMegabytes = 10 * 1024 * 1024;

@Component({
  imports: [
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

  // PrimeNG fills in {0}; Angular's template i18n would drop the braces, $localize keeps them.
  protected readonly uploadMessages = {
    tooLarge: $localize`:@@documents.tooLarge:{0} is too large.`,
    tooLargeDetail: $localize`:@@documents.tooLargeDetail:A document can be at most {0}.`,
    notPdf: $localize`:@@documents.notPdf:{0} isn't a PDF.`,
    notPdfDetail: $localize`:@@documents.notPdfDetail:Only PDF files can be attached.`,
  };
  protected readonly progress = signal<number | undefined>(undefined);
  protected readonly problem = signal<string | undefined>(undefined);

  protected downloadLabel(fileName: string): string {
    return $localize`:@@documents.download:Download ${fileName}:fileName:`;
  }

  protected removeLabel(fileName: string): string {
    return $localize`:@@documents.removeNamed:Remove ${fileName}:fileName:`;
  }

  protected async attach(event: FileUploadHandlerEvent, uploader: FileUpload): Promise<void> {
    const file = event.files[0];
    uploader.clear();
    if (file === undefined) {
      return;
    }
    this.problem.set(undefined);
    this.progress.set(0);
    try {
      await this.api.attachDocument(this.application().id, file, (percent) =>
        this.progress.set(percent),
      );
      this.changed.emit();
    } catch (error) {
      this.problem.set(problemMessage(problemFrom(error)));
    } finally {
      this.progress.set(undefined);
    }
  }

  protected async remove(document: SupportingDocument): Promise<void> {
    this.problem.set(undefined);
    try {
      await this.api.removeDocument(this.application().id, document.id);
      this.changed.emit();
    } catch (error) {
      this.problem.set(problemMessage(problemFrom(error)));
    }
  }

  protected async download(document: SupportingDocument): Promise<void> {
    this.problem.set(undefined);
    try {
      saveFile(
        await this.api.downloadDocument(this.application().id, document.id),
        document.fileName,
      );
    } catch (error) {
      this.problem.set(problemMessage(problemFrom(error)));
    }
  }
}
