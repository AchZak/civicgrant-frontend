import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { CurrentUser } from '../../auth/current-user';
import { LanguageSwitch } from '../language-switch/language-switch';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  imports: [RouterLink, RouterLinkActive, TranslocoDirective, LanguageSwitch, UserMenu],
  selector: 'app-shell',
  templateUrl: './shell.html',
})
export class Shell {
  protected readonly user = inject(CurrentUser);
}
