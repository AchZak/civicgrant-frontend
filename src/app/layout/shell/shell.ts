import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSwitch } from '../language-switch/language-switch';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  imports: [RouterLink, RouterLinkActive, LanguageSwitch, UserMenu],
  selector: 'app-shell',
  templateUrl: './shell.html',
})
export class Shell {}
