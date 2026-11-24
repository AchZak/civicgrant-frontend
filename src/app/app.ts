import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shell } from './layout/shell/shell';

@Component({
  imports: [RouterOutlet, Shell],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
