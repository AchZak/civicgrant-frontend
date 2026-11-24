import { Component, input } from '@angular/core';

// An attribute selector: a <dl> may only hold dt, dd or div groups.
@Component({
  selector: 'div[app-detail]',
  templateUrl: './detail.html',
})
export class Detail {
  readonly label = input.required<string>();
}
