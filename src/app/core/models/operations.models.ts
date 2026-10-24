export type TimeRange = 'weekly' | 'monthly' | 'yearly';

export type KpiFormat = 'number' | 'percent' | 'currency';

export interface Kpi {
  id: 'activeProjects' | 'activeEmployees' | 'efficiencyRate' | 'monthlyRevenue';
  label: string;
  value: number;
  format: KpiFormat;
  trend: number; // percentage, signed
  icon: string; // Bootstrap Icons class, e.g. 'bi-lightning-charge'
  accent: 'emerald' | 'lime' | 'violet' | 'dark';
}

export type ProjectStatus = 'In Progress' | 'Pending' | 'Completed';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number; // 0-100
}

export type Department = 'Manufacturing' | 'Engineering' | 'Logistics';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Busy';

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  avatar: string;
  hoursLogged: number; // for the selected time range
}

export interface PerformancePoint {
  label: string; // e.g. 'Mon', 'W1', 'Jan'
  efficiency: number; // 0-100
  output: number; // produced units
}
