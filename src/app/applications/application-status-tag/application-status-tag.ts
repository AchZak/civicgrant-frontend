import { Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { ApplicationStatus } from '../applications-api';
import { applicationStatusLabel, applicationStatusSeverity } from '../application-status';

@Component({
  imports: [Tag],
  selector: 'app-application-status-tag',
  template: '<p-tag [value]="label()" [severity]="severity()" />',
})
export class ApplicationStatusTag {
  readonly status = input.required<ApplicationStatus>();

  protected readonly label = computed(() => applicationStatusLabel(this.status()));
  protected readonly severity = computed(() => applicationStatusSeverity(this.status()));
}
