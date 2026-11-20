import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  accent?: 'default' | 'success' | 'danger' | 'warning' | 'primary';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

export function StatCard({ label, value, sub, icon, accent = 'default', className, trend, trendLabel }: StatCardProps) {
  const accentClasses = {
    default: 'text-text',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    primary: 'text-primary',
  };

  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-4 flex flex-col gap-3',
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div>
        <span className={cn(
          'text-2xl font-semibold tabular',
          accentClasses[accent]
        )}>
          {value}
        </span>
        {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
      </div>
      {trend && trendLabel && (
        <div className={cn(
          'text-xs flex items-center gap-1',
          trend === 'up' && 'text-success',
          trend === 'down' && 'text-danger',
          trend === 'neutral' && 'text-muted',
        )}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trendLabel}
        </div>
      )}
    </div>
  );
}
