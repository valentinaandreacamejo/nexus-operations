import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly dashboard = inject(DashboardService);

  protected readonly navItems: NavItem[] = [
    { label: 'Overview', icon: 'bi-grid-1x2-fill', route: '/overview' },
    { label: 'Projects', icon: 'bi-diagram-3-fill', route: '/projects' },
    { label: 'Employees', icon: 'bi-people-fill', route: '/employees' },
    { label: 'Analytics', icon: 'bi-bar-chart-fill', route: '/analytics' },
    { label: 'Settings', icon: 'bi-gear-fill', route: '/settings' },
  ];

  /** System load shown in the bottom widget, derived from current efficiency. */
  protected readonly systemLoad = computed(() => Math.round(this.dashboard.avgEfficiency()));
}
