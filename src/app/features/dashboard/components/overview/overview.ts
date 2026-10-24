import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { KpiCard } from '../../../../shared/components/kpi-card/kpi-card';
import { RangeToggle } from '../../../../shared/components/range-toggle/range-toggle';
import { PerformanceChart } from '../performance-chart/performance-chart';
import { ProjectKanban } from '../project-kanban/project-kanban';
import { EmployeeTable } from '../employee-table/employee-table';

const PERIOD_CAPTION = { weekly: 'vs last week', monthly: 'vs last month', yearly: 'vs last year' } as const;

@Component({
  selector: 'app-overview',
  imports: [KpiCard, RangeToggle, PerformanceChart, ProjectKanban, EmployeeTable],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  protected readonly dashboard = inject(DashboardService);

  protected readonly periodCaption = computed(() => PERIOD_CAPTION[this.dashboard.timeRange()]);
}
