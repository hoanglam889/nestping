import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ExternalLink, Pause, Play, RefreshCw, Pencil, 
  CheckCircle, XCircle, Activity 
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResponseTimeChart } from '@/components/monitors/ResponseTimeChart';
import { UptimeBar } from '@/components/monitors/UptimeBar';
import { EditMonitorDialog } from '@/components/monitors/EditMonitorDialog';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import { 
  responseTimeData, 
  checkResults, 
  uptimeHistory 
} from '@/data/mockData';
import { 
  formatResponseTime, formatRelativeTime, formatUptime, 
  formatTimestamp, formatCheckInterval, cn 
} from '@/lib/utils';
import type { Monitor } from '@/types';

export function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { monitors, incidents, updateMonitor, togglePauseMonitor, triggerManualCheck } = useMonitoring();
  const [editOpen, setEditOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const monitor = monitors.find(m => m.id === id);

  if (!monitor) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Activity className="h-10 w-10 text-muted opacity-40 mb-3" />
          <h2 className="text-base font-semibold text-text mb-1">Monitor Not Found</h2>
          <p className="text-muted text-xs mb-4">The monitor with ID "{id}" does not exist or was deleted.</p>
          <Button variant="secondary" size="md" onClick={() => navigate('/monitors')}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Monitors
          </Button>
        </div>
      </PageContainer>
    );
  }

  const monitorIncidents = incidents.filter(i => i.monitorId === id);
  const monitorChecks = checkResults.filter(c => c.monitorId === id).slice(0, 10);
  const chartData = responseTimeData[id!] || responseTimeData['mon-1'];
  const history = uptimeHistory[id!] || uptimeHistory['mon-1'];

  const handleSave = (updated: Monitor) => {
    updateMonitor(updated);
    toast(`"${updated.name}" updated successfully.`, 'success');
  };

  const handleTogglePause = () => {
    togglePauseMonitor(monitor.id);
    const willPause = monitor.status !== 'paused';
    toast(willPause ? 'Monitor paused.' : 'Monitor resumed.', 'info');
  };

  const handleManualCheck = async () => {
    setChecking(true);
    await new Promise(r => setTimeout(r, 900));
    triggerManualCheck(monitor.id);
    setChecking(false);
    toast(`Checked ${monitor.name}. Response received in ${monitor.responseTime || 204}ms.`, 'success');
  };

  return (
    <PageContainer>
      {/* Back button */}
      <div className="mb-4">
        <Link to="/monitors" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Monitors
        </Link>
      </div>

      {/* Monitor Header */}
      <div className="bg-card border border-border rounded-lg p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-semibold text-text">{monitor.name}</h1>
              <StatusBadge status={monitor.status} />
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors mt-1.5 font-mono"
            >
              {monitor.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={handleManualCheck} disabled={checking}>
              <RefreshCw className={cn('h-3.5 w-3.5', checking && 'animate-spin')} />
              {checking ? 'Checking...' : 'Check Now'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={handleTogglePause}>
              {monitor.status === 'paused'
                ? <><Play className="h-3.5 w-3.5 text-success" /> Resume</>
                : <><Pause className="h-3.5 w-3.5 text-muted" /> Pause</>
              }
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Check Interval</p>
            <p className="text-xs text-text tabular font-medium">{formatCheckInterval(monitor.checkInterval)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Last Checked</p>
            <p className="text-xs text-text tabular font-medium">{formatRelativeTime(monitor.lastChecked)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Created</p>
            <p className="text-xs text-text tabular font-medium">{formatTimestamp(monitor.createdAt, 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Current Latency</p>
            <p className={cn(
              'text-xs tabular font-medium',
              monitor.status === 'down' ? 'text-danger' : monitor.responseTime > 800 ? 'text-warning' : 'text-primary'
            )}>
              {formatResponseTime(monitor.responseTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">30-Day Uptime</p>
          <p className={cn('text-2xl font-semibold tabular', monitor.uptime >= 99.9 ? 'text-success' : monitor.uptime >= 99 ? 'text-warning' : 'text-danger')}>
            {formatUptime(monitor.uptime)}
          </p>
          <p className="text-[10px] text-muted mt-1">Target SLA 99.9%</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Avg Response Time</p>
          <p className={cn('text-2xl font-semibold tabular', monitor.responseTime > 800 ? 'text-warning' : monitor.responseTime === 0 ? 'text-danger' : 'text-primary')}>
            {formatResponseTime(monitor.responseTime || 248)}
          </p>
          <p className="text-[10px] text-muted mt-1">24h rolling average</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Total Incidents</p>
          <p className="text-2xl font-semibold tabular text-text">{monitorIncidents.length}</p>
          <p className="text-[10px] text-muted mt-1">Past 90 days</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Active Incidents</p>
          <p className={cn('text-2xl font-semibold tabular', monitorIncidents.some(i => i.status === 'active') ? 'text-danger' : 'text-success')}>
            {monitorIncidents.filter(i => i.status === 'active').length}
          </p>
          <p className="text-[10px] text-muted mt-1">
            {monitorIncidents.some(i => i.status === 'active') ? 'Active disruption' : 'All clear'}
          </p>
        </div>
      </div>

      {/* Response Time History Chart */}
      <div className="mb-5">
        <ResponseTimeChart data={chartData} title="Response Time History" />
      </div>

      {/* Uptime History Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-text">Uptime History (Last 90 Days)</h3>
            <p className="text-xs text-muted mt-0.5">Continuous health bars representing 24-hour periods</p>
          </div>
          <span className="text-xs font-semibold tabular text-success">
            {formatUptime(monitor.uptime)} uptime
          </span>
        </div>
        <UptimeBar periods={history} bars={90} />
        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-success" />
            <span className="text-xs text-muted">Operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-warning" />
            <span className="text-xs text-muted">Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-danger" />
            <span className="text-xs text-muted">Down</span>
          </div>
        </div>
      </div>

      {/* Recent Checks & Incident History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Checks Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">Recent Health Checks</h3>
            <span className="text-xs text-muted">Last 10 checks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[380px]">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">HTTP Code</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monitorChecks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted">
                      No check results recorded yet.
                    </td>
                  </tr>
                ) : (
                  monitorChecks.map(check => (
                    <tr key={check.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-muted tabular">{formatRelativeTime(check.checkedAt)}</td>
                      <td className="px-4 py-2.5">
                        {check.success ? (
                          <div className="flex items-center gap-1.5 text-xs text-success">
                            <CheckCircle className="h-3.5 w-3.5" /> OK
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-danger" title={check.errorMessage}>
                            <XCircle className="h-3.5 w-3.5" /> {check.errorMessage || check.errorType || 'Failed'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs tabular font-mono text-text">
                        {check.statusCode ? (
                          <span className={check.statusCode >= 200 && check.statusCode < 300 ? 'text-success' : 'text-danger'}>
                            {check.statusCode}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-xs tabular text-text">
                        {formatResponseTime(check.responseTime || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">Associated Incidents</h3>
            <span className="text-xs text-muted">{monitorIncidents.length} total</span>
          </div>
          {monitorIncidents.length === 0 ? (
            <div className="p-8 text-center my-auto">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2 opacity-60" />
              <p className="text-xs font-medium text-text">Zero Disruption History</p>
              <p className="text-[10px] text-muted mt-1">No downtime or performance degradation recorded for this monitor.</p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-y-auto max-h-[360px]">
              {monitorIncidents.map(incident => (
                <div key={incident.id} className="px-4 py-3 hover:bg-background/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Link
                      to={`/incidents/${incident.id}`}
                      className="text-xs font-medium text-text hover:text-primary transition-colors line-clamp-1"
                    >
                      {incident.title}
                    </Link>
                    <Badge variant={incident.status === 'active' ? 'active' : 'resolved'}>
                      {incident.status === 'active' ? 'Active' : 'Resolved'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted mt-1">
                    <span className="tabular">{formatTimestamp(incident.startedAt)}</span>
                    {incident.duration && (
                      <span className="tabular font-medium text-text">
                        Duration: {Math.floor(incident.duration / 60)}h {incident.duration % 60}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditMonitorDialog open={editOpen} onOpenChange={setEditOpen} monitor={monitor} onSave={handleSave} />
    </PageContainer>
  );
}
