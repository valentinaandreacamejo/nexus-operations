import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Topbar } from './shared/components/topbar/topbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  imports: [RouterOutlet, Sidebar, Topbar, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
