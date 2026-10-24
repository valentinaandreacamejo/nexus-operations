import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Kpi } from '../../../core/models/operations.models';

@Component({
  selector: 'app-kpi-card',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"accent-" + kpi().accent',
  },
})
export class KpiCard {
  readonly kpi = input.required<Kpi>();
  /** Caption under the trend badge, e.g. "vs last month". */
  readonly period = input('vs previous period');

  protected readonly isPositive = computed(() => this.kpi().trend >= 0);
}
