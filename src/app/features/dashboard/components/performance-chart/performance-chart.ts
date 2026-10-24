import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { TimeRange } from '../../../../core/models/operations.models';

/** Bars are scaled from this floor so small efficiency differences stay readable. */
const SCALE_MIN = 70;

/**
 * Pure CSS bar chart for production efficiency.
 * Hover or click a bar to pin its details in the header.
 */
@Component({
  selector: 'app-performance-chart',
  imports: [DecimalPipe],
  templateUrl: './performance-chart.html',
  styleUrl: './performance-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceChart {
  protected readonly dashboard = inject(DashboardService);

  /** Resets to null whenever the time range (and thus the dataset) changes. */
  protected readonly selectedIndex = linkedSignal<TimeRange, number | null>({
    source: this.dashboard.timeRange,
    computation: () => null,
  });

  protected readonly bars = computed(() => {
    const points = this.dashboard.performance();
    const peak = Math.max(...points.map((p) => p.efficiency));
    return points.map((p) => ({
      ...p,
      height: ((p.efficiency - SCALE_MIN) / (100 - SCALE_MIN)) * 100,
      isPeak: p.efficiency === peak,
    }));
  });

  /** Selected bar, or the peak one when nothing is selected. */
  protected readonly focus = computed(() => {
    const bars = this.bars();
    const i = this.selectedIndex();
    return (i !== null ? bars[i] : undefined) ?? bars.find((b) => b.isPeak)!;
  });

  /** 90% target, offset by the 24px label gutter at the bottom of the plot. */
  protected readonly targetLineBottom = `calc(24px + (100% - 24px) * ${(90 - SCALE_MIN) / (100 - SCALE_MIN)})`;
}
