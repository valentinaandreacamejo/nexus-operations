import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    title: 'Overview · NEXUS_OPERATIONS',
    loadComponent: () =>
      import('./features/dashboard/components/overview/overview').then((m) => m.Overview),
  },
  {
    path: 'projects',
    title: 'Projects · NEXUS_OPERATIONS',
    loadComponent: () =>
      import('./features/dashboard/components/project-kanban/project-kanban').then((m) => m.ProjectKanban),
  },
  {
    path: 'employees',
    title: 'Employees · NEXUS_OPERATIONS',
    loadComponent: () =>
      import('./features/dashboard/components/employee-table/employee-table').then((m) => m.EmployeeTable),
  },
  {
    path: 'analytics',
    title: 'Analytics · NEXUS_OPERATIONS',
    loadComponent: () =>
      import('./features/dashboard/components/performance-chart/performance-chart').then((m) => m.PerformanceChart),
  },
  // TODO: dedicated Settings page
  { path: 'settings', redirectTo: 'overview' },
  { path: '**', redirectTo: 'overview' },
];
