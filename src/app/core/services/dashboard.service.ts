import { Injectable, computed, signal } from '@angular/core';
import {
  Department,
  Employee,
  Kpi,
  PerformancePoint,
  Project,
  ProjectStatus,
  TimeRange,
} from '../models/operations.models';

const avatar = (seed: string) => `https://i.pravatar.cc/80?u=${encodeURIComponent(seed)}`;

type KpiSnapshot = Record<Kpi['id'], { value: number; trend: number }>;

/** Monthly figures are the reference values; weekly/yearly are derived snapshots. */
const KPI_BY_RANGE: Record<TimeRange, KpiSnapshot> = {
  weekly: {
    activeProjects: { value: 38, trend: 2.7 },
    activeEmployees: { value: 312, trend: 0.6 },
    efficiencyRate: { value: 93.1, trend: -0.4 },
    monthlyRevenue: { value: 296_400, trend: 3.1 },
  },
  monthly: {
    activeProjects: { value: 42, trend: 8.4 },
    activeEmployees: { value: 318, trend: 3.2 },
    efficiencyRate: { value: 94.2, trend: 1.5 },
    monthlyRevenue: { value: 1_284_500, trend: 12.3 },
  },
  yearly: {
    activeProjects: { value: 57, trend: 21.3 },
    activeEmployees: { value: 331, trend: 9.8 },
    efficiencyRate: { value: 92.7, trend: 4.6 },
    monthlyRevenue: { value: 14_820_000, trend: 18.7 },
  },
};

const PERFORMANCE_BY_RANGE: Record<TimeRange, PerformancePoint[]> = {
  weekly: [
    { label: 'Mon', efficiency: 91, output: 2840 },
    { label: 'Tue', efficiency: 94, output: 3010 },
    { label: 'Wed', efficiency: 89, output: 2760 },
    { label: 'Thu', efficiency: 96, output: 3150 },
    { label: 'Fri', efficiency: 97, output: 3220 },
    { label: 'Sat', efficiency: 92, output: 1680 },
    { label: 'Sun', efficiency: 88, output: 940 },
  ],
  monthly: [
    { label: 'W1', efficiency: 92, output: 17_400 },
    { label: 'W2', efficiency: 95, output: 18_900 },
    { label: 'W3', efficiency: 93, output: 18_100 },
    { label: 'W4', efficiency: 97, output: 19_600 },
  ],
  yearly: [
    { label: 'Jan', efficiency: 88, output: 61_000 },
    { label: 'Feb', efficiency: 90, output: 64_200 },
    { label: 'Mar', efficiency: 91, output: 68_900 },
    { label: 'Apr', efficiency: 89, output: 66_100 },
    { label: 'May', efficiency: 93, output: 71_300 },
    { label: 'Jun', efficiency: 94, output: 73_800 },
    { label: 'Jul', efficiency: 92, output: 70_400 },
    { label: 'Aug', efficiency: 86, output: 52_700 },
    { label: 'Sep', efficiency: 95, output: 75_900 },
    { label: 'Oct', efficiency: 96, output: 77_200 },
    { label: 'Nov', efficiency: 94, output: 74_600 },
    { label: 'Dec', efficiency: 91, output: 63_500 },
  ],
};

/** Multiplier applied to weekly hours to obtain hours for the selected range. */
const HOURS_FACTOR: Record<TimeRange, number> = { weekly: 1, monthly: 4.33, yearly: 48 };

const KPI_META: Omit<Kpi, 'value' | 'trend'>[] = [
  { id: 'activeProjects', label: 'Active Projects', format: 'number', icon: 'bi-diagram-3-fill', accent: 'violet' },
  { id: 'activeEmployees', label: 'Active Employees', format: 'number', icon: 'bi-people-fill', accent: 'emerald' },
  { id: 'efficiencyRate', label: 'Efficiency Rate', format: 'percent', icon: 'bi-speedometer2', accent: 'lime' },
  { id: 'monthlyRevenue', label: 'Revenue', format: 'currency', icon: 'bi-currency-dollar', accent: 'dark' },
];

const matches = (query: string, ...fields: string[]) =>
  !query || fields.some((f) => f.toLowerCase().includes(query));

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // --- State --------------------------------------------------------------
  readonly timeRange = signal<TimeRange>('monthly');
  readonly searchQuery = signal('');

  private readonly _projects = signal<Project[]>([
    { id: 'PRJ-1042', name: 'CNC Line 4 Retrofit', client: 'Vortex Automotive', status: 'In Progress', progress: 68 },
    { id: 'PRJ-1043', name: 'Smart Furnace IoT Sensors', client: 'Ferrum Steelworks', status: 'In Progress', progress: 41 },
    { id: 'PRJ-1044', name: 'Automated Warehouse 2.0', client: 'Granaria Foods', status: 'Pending', progress: 12 },
    { id: 'PRJ-1045', name: 'ISO 50001 Energy Audit', client: 'Helix Tyres', status: 'Completed', progress: 100 },
    { id: 'PRJ-1046', name: 'Robotic Palletizing Cell', client: 'Aroma Roasters', status: 'In Progress', progress: 83 },
    { id: 'PRJ-1047', name: 'Predictive Maintenance AI', client: 'Volta Energy', status: 'Pending', progress: 5 },
    { id: 'PRJ-1048', name: 'Clean Room Expansion', client: 'Medica Pharma', status: 'Completed', progress: 100 },
  ]);

  /** Base data: hours are per week; `employees` scales them to the active range. */
  private readonly _employees = signal<(Omit<Employee, 'hoursLogged'> & { weeklyHours: number })[]>([
    { id: 1, name: 'Alex Mercer', role: 'Ops Lead', department: 'Manufacturing', status: 'Active', avatar: avatar('alex'), weeklyHours: 46 },
    { id: 2, name: 'Giulia Ferri', role: 'Process Engineer', department: 'Engineering', status: 'Busy', avatar: avatar('giulia'), weeklyHours: 44 },
    { id: 3, name: 'Marco Valli', role: 'Maintenance Technician', department: 'Manufacturing', status: 'Active', avatar: avatar('marco'), weeklyHours: 40 },
    { id: 4, name: 'Sara Kim', role: 'Quality Analyst', department: 'Engineering', status: 'On Leave', avatar: avatar('sara'), weeklyHours: 18 },
    { id: 5, name: 'Luca Bianchi', role: 'Supply Planner', department: 'Logistics', status: 'Active', avatar: avatar('luca'), weeklyHours: 38 },
    { id: 6, name: 'Nadia Rossi', role: 'Automation Engineer', department: 'Engineering', status: 'Busy', avatar: avatar('nadia'), weeklyHours: 42 },
    { id: 7, name: 'Omar Haddad', role: 'Fleet Coordinator', department: 'Logistics', status: 'Active', avatar: avatar('omar'), weeklyHours: 39 },
  ]);

  // --- Derived ------------------------------------------------------------
  readonly kpis = computed<Kpi[]>(() => {
    const snapshot = KPI_BY_RANGE[this.timeRange()];
    return KPI_META.map((meta) => ({ ...meta, ...snapshot[meta.id] }));
  });

  readonly performance = computed(() => PERFORMANCE_BY_RANGE[this.timeRange()]);

  readonly avgEfficiency = computed(() => {
    const points = this.performance();
    return Math.round((points.reduce((sum, p) => sum + p.efficiency, 0) / points.length) * 10) / 10;
  });

  readonly projects = computed(() => {
    const q = this.normalizedQuery();
    return this._projects().filter((p) => matches(q, p.name, p.client, p.id));
  });

  readonly projectCounts = computed(() => {
    const counts: Record<ProjectStatus, number> = { 'In Progress': 0, Pending: 0, Completed: 0 };
    for (const p of this._projects()) counts[p.status]++;
    return counts;
  });

  readonly employees = computed<Employee[]>(() => {
    const factor = HOURS_FACTOR[this.timeRange()];
    const q = this.normalizedQuery();
    return this._employees()
      .filter((e) => matches(q, e.name, e.role, e.department))
      .map(({ weeklyHours, ...e }) => ({ ...e, hoursLogged: Math.round(weeklyHours * factor) }));
  });

  readonly totalHours = computed(() => this.employees().reduce((sum, e) => sum + e.hoursLogged, 0));

  readonly departments: Department[] = ['Manufacturing', 'Engineering', 'Logistics'];

  private readonly normalizedQuery = computed(() => this.searchQuery().trim().toLowerCase());

  // --- Mutations ----------------------------------------------------------
  setTimeRange(range: TimeRange): void {
    this.timeRange.set(range);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
  }

  updateProjectStatus(id: string, status: ProjectStatus): void {
    this._projects.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status, progress: status === 'Completed' ? 100 : p.progress } : p)),
    );
  }
}
