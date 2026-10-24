import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TimeRange } from '../../../core/models/operations.models';

@Component({
  selector: 'app-range-toggle',
  templateUrl: './range-toggle.html',
  styleUrl: './range-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeToggle {
  protected readonly dashboard = inject(DashboardService);

  protected readonly options: { value: TimeRange; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  protected readonly activeIndex = computed(() =>
    this.options.findIndex((o) => o.value === this.dashboard.timeRange()),
  );
}
