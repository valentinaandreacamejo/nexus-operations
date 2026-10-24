import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class Topbar {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly dashboard = inject(DashboardService);

  protected readonly notifications = signal(5);
  protected readonly menuOpen = signal(false);

  protected readonly user = {
    name: 'Alex Mercer',
    role: 'Ops Lead',
    avatar: 'https://i.pravatar.cc/80?u=alex',
  };

  protected readonly menuItems = [
    { label: 'My profile', icon: 'bi-person' },
    { label: 'Preferences', icon: 'bi-sliders' },
    { label: 'Help center', icon: 'bi-question-circle' },
  ];

  protected onSearch(event: Event): void {
    this.dashboard.setSearch((event.target as HTMLInputElement).value);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.menuOpen.set(false);
  }
}
