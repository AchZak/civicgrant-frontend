import { Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { ApplicationStatus } from '../applications-api';
import { applicationStatusKey, applicationStatusSeverity } from '../application-status';

@Component({
  imports: [TranslocoDirective, Tag],
  selector: 'app-application-status-tag',
  template: '<p-tag *transloco="let t" [value]="t(labelKey())" [severity]="severity()" />',
})
export class ApplicationStatusTag {
  readonly status = input.required<ApplicationStatus>();

  protected readonly labelKey = computed(() => applicationStatusKey(this.status()));
  protected readonly severity = computed(() => applicationStatusSeverity(this.status()));
}
