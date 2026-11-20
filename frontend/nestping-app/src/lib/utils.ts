import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, formatDuration, intervalToDuration } from 'date-fns';
import type { MonitorStatus, CheckInterval } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

export function formatTimestamp(dateStr: string, fmt = 'MMM d, HH:mm'): string {
  try {
    return format(new Date(dateStr), fmt);
  } catch {
    return 'Unknown';
  }
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDurationFromDates(start: string, end?: string): string {
  try {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const duration = intervalToDuration({ start: startDate, end: endDate });
    return formatDuration(duration, { format: ['hours', 'minutes'] }) || 'less than a minute';
  } catch {
    return 'Unknown';
  }
}

export function formatResponseTime(ms: number): string {
  if (ms === 0) return '—';
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(2)}%`;
}

export function formatCheckInterval(seconds: CheckInterval): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${seconds / 60}m`;
  return `${seconds / 3600}h`;
}

export function getStatusColor(status: MonitorStatus): string {
  switch (status) {
    case 'operational': return 'text-success';
    case 'degraded': return 'text-warning';
    case 'down': return 'text-danger';
    case 'paused': return 'text-muted';
  }
}

export function getStatusBgColor(status: MonitorStatus): string {
  switch (status) {
    case 'operational': return 'bg-success/10 text-success border-success/20';
    case 'degraded': return 'bg-warning/10 text-warning border-warning/20';
    case 'down': return 'bg-danger/10 text-danger border-danger/20';
    case 'paused': return 'bg-muted/10 text-muted border-muted/20';
  }
}

export function getStatusLabel(status: MonitorStatus): string {
  switch (status) {
    case 'operational': return 'Operational';
    case 'degraded': return 'Degraded';
    case 'down': return 'Down';
    case 'paused': return 'Paused';
  }
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
