import { cn } from '@/lib/utils';
import type { UptimePeriod } from '@/types';

interface UptimeBarProps {
  periods: UptimePeriod[];
  bars?: number;
  label?: string;
}

function getBarColor(status: 'up' | 'down' | 'degraded'): string {
  switch (status) {
    case 'up': return 'bg-success';
    case 'down': return 'bg-danger';
    case 'degraded': return 'bg-warning';
  }
}

export function UptimeBar({ periods, bars = 90, label }: UptimeBarProps) {
  if (!periods.length) return null;

  const start = new Date(periods[0].start).getTime();
  const end = new Date(periods[periods.length - 1].end).getTime();
  const totalMs = end - start;

  // Map each bar index to its period
  const barStatuses = Array.from({ length: bars }, (_, i) => {
    const barTime = start + (i / bars) * totalMs;
    const period = periods.find(p => {
      const ps = new Date(p.start).getTime();
      const pe = new Date(p.end).getTime();
      return barTime >= ps && barTime < pe;
    });
    return period?.status ?? 'up';
  });

  return (
    <div>
      {label && <p className="text-xs text-muted mb-2">{label}</p>}
      <div className="flex gap-0.5 items-end h-7">
        {barStatuses.map((status, i) => (
          <div
            key={i}
            title={status === 'up' ? 'Operational' : status === 'down' ? 'Down' : 'Degraded'}
            className={cn(
              'flex-1 rounded-sm transition-opacity hover:opacity-80',
              getBarColor(status as 'up' | 'down' | 'degraded'),
              status === 'up' ? 'h-5' : status === 'degraded' ? 'h-6' : 'h-7',
            )}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted">90 days ago</span>
        <span className="text-[10px] text-muted">Today</span>
      </div>
    </div>
  );
}
