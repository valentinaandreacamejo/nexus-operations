import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { Department, EmployeeStatus } from '../../../../core/models/operations.models';

type SortKey = 'name' | 'hoursLogged';

@Component({
  selector: 'app-employee-table',
  imports: [DecimalPipe],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTable {
  protected readonly dashboard = inject(DashboardService);

  protected readonly departmentFilters: (Department | 'All')[] = ['All', ...this.dashboard.departments];
  protected readonly department = signal<Department | 'All'>('All');
  protected readonly sortKey = signal<SortKey>('hoursLogged');
  protected readonly sortDesc = signal(true);

  protected readonly rows = computed(() => {
    const dept = this.department();
    const key = this.sortKey();
    const dir = this.sortDesc() ? -1 : 1;
    return this.dashboard
      .employees()
      .filter((e) => dept === 'All' || e.department === dept)
      .sort((a, b) =>
        key === 'name' ? a.name.localeCompare(b.name) * dir : (a.hoursLogged - b.hoursLogged) * dir,
      );
  });

  protected readonly maxHours = computed(() => Math.max(1, ...this.rows().map((e) => e.hoursLogged)));
  protected readonly totalHours = computed(() => this.rows().reduce((sum, e) => sum + e.hoursLogged, 0));

  protected readonly statusBadge: Record<EmployeeStatus, string> = {
    Active: 'badge--emerald',
    Busy: 'badge--violet',
    'On Leave': 'badge--warning',
  };

  protected readonly departmentIcon: Record<Department, string> = {
    Manufacturing: 'bi-gear-wide-connected',
    Engineering: 'bi-cpu',
    Logistics: 'bi-truck',
  };

  protected sortBy(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDesc.update((d) => !d);
    } else {
      this.sortKey.set(key);
      this.sortDesc.set(key === 'hoursLogged');
    }
  }
}
