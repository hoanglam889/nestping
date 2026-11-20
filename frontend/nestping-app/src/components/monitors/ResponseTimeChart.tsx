import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';
import type { ResponseDataPoint } from '@/types';

interface ResponseTimeChartProps {
  data: { '24h': ResponseDataPoint[]; '7d': ResponseDataPoint[]; '30d'?: ResponseDataPoint[] };
  title?: string;
  showPeriodSelector?: boolean;
}

type Period = '24h' | '7d' | '30d';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-medium tabular text-primary">
        {payload[0].value > 0 ? `${payload[0].value}ms` : '—'}
      </p>
    </div>
  );
}

export function ResponseTimeChart({ data, title = 'Response Time', showPeriodSelector = true }: ResponseTimeChartProps) {
  const [period, setPeriod] = useState<Period>('24h');
  const chartData = data[period] || data['24h'];

  // Sample down for readability
  const displayData = period === '30d'
    ? chartData.filter((_, i) => i % 4 === 0)
    : period === '7d'
    ? chartData.filter((_, i) => i % 2 === 0)
    : chartData;

  const periods: Period[] = data['30d'] ? ['24h', '7d', '30d'] : ['24h', '7d'];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text">{title}</h3>
        {showPeriodSelector && (
          <div className="flex items-center bg-background border border-border rounded-md p-0.5">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded transition-colors',
                  period === p
                    ? 'bg-card text-text font-medium'
                    : 'text-muted hover:text-text',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={displayData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#253247" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#8493A8', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8493A8', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v === 0 ? '—' : `${v}`}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#22D3EE"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: '#22D3EE', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
