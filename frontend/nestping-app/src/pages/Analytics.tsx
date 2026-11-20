import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, TrendingUp, Clock, ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useMonitoring } from '@/context/MonitoringContext';
import { 
  analyticsUptimeTrend, 
  analyticsResponseTrend 
} from '@/data/mockData';
import { formatResponseTime, formatUptime, cn } from '@/lib/utils';

type DateRange = '7d' | '14d' | '30d';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 shadow-xl text-xs">
      <p className="text-muted mb-1 font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="tabular font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.unit || ''}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('30d');
  const { monitors, stats } = useMonitoring();

  // Slice trend data based on selected range
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;

  const uptimeTrendData = useMemo(() => {
    return analyticsUptimeTrend.slice(-days);
  }, [days]);

  const responseTrendData = useMemo(() => {
    return analyticsResponseTrend.slice(-days);
  }, [days]);

  // Dynamic monitor comparison from active monitors in context
  const monitorComparisonData = useMemo(() => {
    return monitors.map(m => ({
      name: m.name,
      uptime: m.uptime,
      responseTime: m.responseTime || 0,
    }));
  }, [monitors]);

  const downtimeDistributionData = useMemo(() => {
    const totalMinutes = days * 24 * 60;
    return monitors.map(m => ({
      name: m.name,
      downtime: Math.round(totalMinutes * (1 - m.uptime / 100)),
    }));
  }, [monitors, days]);

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        subtitle="Performance, latency distributions, and reliability metrics across your infrastructure."
        actions={
          <div className="flex items-center bg-card border border-border rounded-md p-0.5">
            <div className="px-2 py-1 text-muted text-xs flex items-center gap-1 border-r border-border mr-0.5">
              <Calendar className="h-3 w-3" /> Range:
            </div>
            {(['7d', '14d', '30d'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded transition-colors font-medium',
                  range === r
                    ? 'bg-background text-text shadow-sm'
                    : 'text-muted hover:text-text'
                )}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Fleet Uptime"
          value={formatUptime(stats.avgUptime)}
          sub={`Average over past ${days} days`}
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Mean Latency"
          value={formatResponseTime(stats.avgResponseTime)}
          sub="Fleet-wide median"
          icon={<Clock className="h-4 w-4" />}
          accent="primary"
        />
        <StatCard
          label="P95 Latency"
          value="418ms"
          sub="95% of checks faster than this"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="default"
        />
        <StatCard
          label="Mean Time to Recovery"
          value="14m"
          sub="Average incident duration"
          icon={<BarChart3 className="h-4 w-4" />}
          accent="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Latency Trends Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text">Latency Trends</h3>
              <p className="text-xs text-muted mt-0.5">Average vs. 95th Percentile Response Time (ms)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" /> Avg
              </span>
              <span className="flex items-center gap-1.5 text-warning">
                <span className="h-2 w-2 rounded-full bg-warning" /> P95
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={responseTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#253247" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg" name="Avg Latency" stroke="#22D3EE" strokeWidth={1.5} fill="url(#avgGrad)" unit="ms" />
              <Line type="monotone" dataKey="p95" name="P95 Latency" stroke="#F5B942" strokeWidth={1.5} dot={false} strokeDasharray="4 2" unit="ms" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Uptime Trend Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text">Fleet Uptime Trend</h3>
              <p className="text-xs text-muted mt-0.5">Aggregated uptime percentage per day</p>
            </div>
            <span className="text-xs font-semibold tabular text-success">
              Min: 99.42% · Max: 100%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={uptimeTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#253247" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} />
              <YAxis domain={[98.5, 100]} tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="uptime" name="Uptime" stroke="#35D07F" strokeWidth={2} dot={false} unit="%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Monitor Comparison Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text">Service Response Comparison</h3>
              <p className="text-xs text-muted mt-0.5">Current response times across monitored services</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monitorComparisonData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#253247" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} unit="ms" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#E5EDF7' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="responseTime" name="Response Time" fill="#22D3EE" radius={[0, 4, 4, 0]} unit="ms" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Downtime Distribution */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text">Downtime Impact (Minutes)</h3>
              <p className="text-xs text-muted mt-0.5">Cumulative downtime over the selected {days}-day period</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={downtimeDistributionData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#253247" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8493A8' }} tickLine={false} axisLine={false} unit="m" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="downtime" name="Downtime" fill="#F05265" radius={[4, 4, 0, 0]} unit=" mins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
}
