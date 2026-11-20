// Core types for NestPing

export type MonitorStatus = 'operational' | 'degraded' | 'down' | 'paused';

export type IncidentStatus = 'active' | 'resolved';

export type CheckInterval = 60 | 300 | 600 | 1800 | 3600;

export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  responseTime: number; // ms
  uptime: number; // percentage 0-100
  checkInterval: CheckInterval; // seconds
  lastChecked: string; // ISO date
  createdAt: string; // ISO date
  paused?: boolean;
}

export type IncidentEventType =
  | 'failure_detected'
  | 'threshold_reached'
  | 'incident_created'
  | 'recovery_detected'
  | 'incident_resolved'
  | 'monitoring_resumed';

export interface IncidentEvent {
  id: string;
  type: IncidentEventType;
  timestamp: string; // ISO date
  message: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  title: string;
  status: IncidentStatus;
  startedAt: string; // ISO date
  resolvedAt?: string; // ISO date
  duration?: number; // minutes
  timeline: IncidentEvent[];
}

export type CheckStatus = 'success' | 'timeout' | 'error' | 'ssl_error' | 'dns_error';

export interface CheckResult {
  id: string;
  monitorId: string;
  checkedAt: string; // ISO date
  success: boolean;
  statusCode?: number;
  responseTime?: number; // ms
  errorType?: CheckStatus;
  errorMessage?: string;
}

export interface ResponseDataPoint {
  time: string;
  responseTime: number;
}

export interface UptimePeriod {
  start: string;
  end: string;
  status: 'up' | 'down' | 'degraded';
}

export interface NotificationSettings {
  telegram: boolean;
  downAlerts: boolean;
  recoveryAlerts: boolean;
  email: boolean;
  emailAddress: string;
}

export interface MonitoringDefaults {
  checkInterval: CheckInterval;
  failureThreshold: number;
  timeout: number; // seconds
}

export interface UserProfile {
  displayName: string;
  email: string;
  avatar?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}
