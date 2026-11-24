import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Session } from '../../auth/session';

@Component({
  imports: [ButtonDirective, ButtonLabel, Menu],
  selector: 'app-user-menu',
  templateUrl: './user-menu.html',
})
export class UserMenu {
  private readonly session = inject(Session);

  protected readonly userName = this.session.userName;
  protected readonly open = signal(false);
  protected readonly items: MenuItem[] = [
    {
      label: $localize`:@@layout.signOut:Sign out`,
      command: () => void this.session.signOut(),
    },
  ];
}
