import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly headingLang = input<string | null>(null);
  readonly intro = input<string>();
}
