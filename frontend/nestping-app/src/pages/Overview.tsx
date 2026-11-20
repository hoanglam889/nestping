import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, AlertTriangle, Clock, TrendingUp, Plus,
  CheckCircle, XCircle
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResponseTimeChart } from '@/components/monitors/ResponseTimeChart';
import { AddMonitorDialog } from '@/components/monitors/AddMonitorDialog';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import { responseTimeData } from '@/data/mockData';
import { formatResponseTime, formatRelativeTime, formatUptime, formatDurationMinutes, cn } from '@/lib/utils';
import type { Monitor } from '@/types';

function IncidentStatusIcon({ status }: { status: 'active' | 'resolved' }) {
  if (status === 'active') return <XCircle className="h-3.5 w-3.5 text-danger flex-shrink-0" />;
  return <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />;
}

export function OverviewPage() {
  const { monitors, incidents, stats, addMonitor } = useMonitoring();
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const handleAddMonitor = (monitor: Monitor) => {
    addMonitor(monitor);
    toast(`Monitor "${monitor.name}" added successfully.`, 'success');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        subtitle="Monitor your services and stay ahead of downtime."
        actions={
          <>
            <Button variant="secondary" size="md" asChild>
              <Link to="/incidents">View Incidents</Link>
            </Button>
            <Button size="md" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add Monitor
            </Button>
          </>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Monitors"
          value={stats.totalMonitors}
          sub={`${stats.operational} operational · ${stats.degraded} degraded · ${stats.down} down`}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="30-Day Uptime"
          value={formatUptime(stats.period30dUptime)}
          sub="Across all monitors"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Avg Response"
          value={formatResponseTime(stats.avgResponseTime)}
          sub="Last 24 hours"
          icon={<Clock className="h-4 w-4" />}
          accent="primary"
        />
        <StatCard
          label="Active Incidents"
          value={stats.activeIncidents}
          sub={stats.activeIncidents > 0 ? 'Requires attention' : 'All clear'}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={stats.activeIncidents > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponseTimeChart
          data={responseTimeData['overview']}
          title="Average Response Time"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monitors table — compact overview version */}
        <div className="xl:col-span-3">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-medium text-text">Monitors</h2>
              <Link to="/monitors" className="text-xs text-primary hover:text-primary/80 transition-colors">
                View all ({monitors.length})
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">Monitor</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider hidden md:table-cell">Response</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider hidden md:table-cell">Uptime</th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">Last Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monitors.map(monitor => (
                    <tr key={monitor.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-4 py-2.5">
                        <Link to={`/monitors/${monitor.id}`} className="text-sm font-medium text-text hover:text-primary transition-colors">
                          {monitor.name}
                        </Link>
                        <p className="text-[10px] text-muted truncate max-w-[140px]">{monitor.url.replace(/^https?:\/\//, '')}</p>
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell">
                        <StatusBadge status={monitor.status} />
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <span className={cn(
                          'text-xs tabular',
                          monitor.status === 'down' ? 'text-danger' : monitor.responseTime > 800 ? 'text-warning' : 'text-text'
                        )}>
                          {formatResponseTime(monitor.responseTime)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <span className={cn(
                          'text-xs tabular',
                          monitor.uptime >= 99.9 ? 'text-success' : monitor.uptime >= 99 ? 'text-warning' : 'text-danger'
                        )}>
                          {formatUptime(monitor.uptime)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted tabular">
                        {formatRelativeTime(monitor.lastChecked)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="xl:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-medium text-text">Recent Incidents</h2>
              <Link to="/incidents" className="text-xs text-primary hover:text-primary/80 transition-colors">
                View all ({incidents.length})
              </Link>
            </div>
            <div className="divide-y divide-border">
              {incidents.slice(0, 4).map(incident => (
                <div key={incident.id} className="px-4 py-3 hover:bg-background/40 transition-colors">
                  <div className="flex items-start gap-2">
                    <IncidentStatusIcon status={incident.status} />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/incidents/${incident.id}`}
                        className="text-xs font-medium text-text hover:text-primary transition-colors line-clamp-1"
                      >
                        {incident.title}
                      </Link>
                      <p className="text-[10px] text-muted mt-0.5">{incident.monitorName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={incident.status === 'active' ? 'active' : 'resolved'}>
                          {incident.status === 'active' ? 'Active' : 'Resolved'}
                        </Badge>
                        <span className="text-[10px] text-muted tabular">{formatRelativeTime(incident.startedAt)}</span>
                        {incident.duration && (
                          <span className="text-[10px] text-muted">· {formatDurationMinutes(incident.duration)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddMonitorDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAddMonitor} />
    </PageContainer>
  );
}
