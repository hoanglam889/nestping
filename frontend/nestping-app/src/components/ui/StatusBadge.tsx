import { cn, getStatusBgColor, getStatusLabel } from '@/lib/utils';
import type { MonitorStatus } from '@/types';

interface StatusBadgeProps {
  status: MonitorStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border',
      getStatusBgColor(status),
      className
    )}>
      {showDot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          status === 'operational' && 'bg-success',
          status === 'degraded' && 'bg-warning',
          status === 'down' && 'bg-danger',
          status === 'paused' && 'bg-muted',
        )} />
      )}
      {getStatusLabel(status)}
    </span>
  );
}
