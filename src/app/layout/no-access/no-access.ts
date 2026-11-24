import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  imports: [RouterLink, TranslocoDirective],
  selector: 'app-no-access',
  templateUrl: './no-access.html',
})
export class NoAccess {}
