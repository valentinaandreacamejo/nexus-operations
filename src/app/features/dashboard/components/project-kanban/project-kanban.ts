import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ProjectStatus } from '../../../../core/models/operations.models';

type StatusFilter = ProjectStatus | 'All';

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.html',
  styleUrl: './project-kanban.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectKanban {
  protected readonly dashboard = inject(DashboardService);

  protected readonly filters: StatusFilter[] = ['All', 'In Progress', 'Pending', 'Completed'];
  protected readonly activeFilter = signal<StatusFilter>('All');

  protected readonly visibleProjects = computed(() => {
    const filter = this.activeFilter();
    const projects = this.dashboard.projects();
    return filter === 'All' ? projects : projects.filter((p) => p.status === filter);
  });

  protected readonly statusBadge: Record<ProjectStatus, string> = {
    'In Progress': 'badge--violet',
    Pending: 'badge--warning',
    Completed: 'badge--emerald',
  };

  protected countFor(filter: StatusFilter): number {
    const counts = this.dashboard.projectCounts();
    return filter === 'All' ? counts['In Progress'] + counts.Pending + counts.Completed : counts[filter];
  }
}
