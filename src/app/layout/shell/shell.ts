import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitch } from '../language-switch/language-switch';

@Component({
  imports: [RouterLink, LanguageSwitch],
  selector: 'app-shell',
  templateUrl: './shell.html',
})
export class Shell {}
