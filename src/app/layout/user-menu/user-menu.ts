import { Component, computed, inject, signal } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';
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
  private readonly signOut = translateSignal('layout.userMenu.actions.signOut');

  protected readonly userName = this.session.userName;
  protected readonly open = signal(false);
  protected readonly items = computed<MenuItem[]>(() => [
    { label: this.signOut(), command: () => void this.session.signOut() },
  ]);
}
