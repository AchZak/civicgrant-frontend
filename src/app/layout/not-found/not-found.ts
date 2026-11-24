import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  imports: [RouterLink, TranslocoDirective],
  selector: 'app-not-found',
  templateUrl: './not-found.html',
})
export class NotFound {}
