import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Search, CheckCircle, XCircle, Clock, AlertTriangle, ArrowLeft, 
  ExternalLink, Check
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import { 
  formatRelativeTime, formatTimestamp, formatDurationMinutes, 
  formatDurationFromDates, cn 
} from '@/lib/utils';
import type { Incident, IncidentEventType } from '@/types';

function TimelineEventIcon({ type }: { type: IncidentEventType }) {
  switch (type) {
    case 'failure_detected':
      return <XCircle className="h-4 w-4 text-danger" />;
    case 'threshold_reached':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'incident_created':
      return <AlertTriangle className="h-4 w-4 text-danger" />;
    case 'recovery_detected':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'incident_resolved':
    case 'monitoring_resumed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    default:
      return <Clock className="h-4 w-4 text-muted" />;
  }
}

function TimelineEventLabel(type: IncidentEventType): string {
  const labels: Record<IncidentEventType, string> = {
    failure_detected: 'Failure Detected',
    threshold_reached: 'Threshold Reached',
    incident_created: 'Incident Triggered',
    recovery_detected: 'Recovery Detected',
    incident_resolved: 'Incident Resolved',
    monitoring_resumed: 'Monitoring Resumed',
  };
  return labels[type] || type;
}

function IncidentDetailView({ incident, onResolve }: { incident: Incident; onResolve: (id: string) => void }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4">
        <Link to="/incidents" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Incidents
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h2 className="text-base font-semibold text-text">{incident.title}</h2>
              <Badge variant={incident.status === 'active' ? 'active' : 'resolved'}>
                {incident.status === 'active' ? 'Active' : 'Resolved'}
              </Badge>
            </div>
            <p className="text-xs text-muted">
              Affected Resource:{' '}
              <Link to={`/monitors/${incident.monitorId}`} className="text-primary hover:underline font-medium">
                {incident.monitorName}
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {incident.status === 'active' && (
              <Button size="sm" onClick={() => onResolve(incident.id)}>
                <Check className="h-3.5 w-3.5" /> Mark Resolved
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => navigate(`/monitors/${incident.monitorId}`)}>
              View Monitor <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-3 bg-background/40 border-b border-border text-xs">
          <div>
            <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">Started</span>
            <span className="text-text tabular font-medium">{formatTimestamp(incident.startedAt, 'MMM d, HH:mm:ss')}</span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">Resolved</span>
            <span className="text-text tabular font-medium">
              {incident.resolvedAt ? formatTimestamp(incident.resolvedAt, 'MMM d, HH:mm:ss') : 'Ongoing'}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">Total Duration</span>
            <span className="text-text tabular font-medium">
              {incident.duration
                ? formatDurationMinutes(incident.duration)
                : formatDurationFromDates(incident.startedAt)}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">Notification Status</span>
            <span className="text-success font-medium">Alerts Dispatched</span>
          </div>
        </div>

        {/* Incident Timeline */}
        <div className="p-5">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-5">Incident Timeline</h3>
          <div className="relative pl-2">
            {incident.timeline.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-4 pb-6 last:pb-2">
                {/* Connecting line */}
                {index < incident.timeline.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
                )}
                <div className="relative z-10 flex-shrink-0 mt-0.5 bg-card">
                  <TimelineEventIcon type={event.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-semibold text-text">{TimelineEventLabel(event.type)}</span>
                    <span className="text-[10px] text-muted tabular">
                      {formatTimestamp(event.timestamp, 'MMM d, HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 bg-background/60 border border-border/60 rounded p-2.5 font-mono text-[11px] leading-relaxed">
                    {event.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IncidentsPage() {
  const { id } = useParams<{ id?: string }>();
  const { incidents, resolveIncident } = useMonitoring();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const selectedIncident = id ? incidents.find(i => i.id === id) : null;

  const handleResolve = (incidentId: string) => {
    resolveIncident(incidentId);
    toast('Incident manually resolved.', 'success');
  };

  const filteredIncidents = useMemo(() => {
    let result = [...incidents];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        i => i.title.toLowerCase().includes(q) || i.monitorName.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      result = result.filter(i => i.status === filter);
    }
    return result;
  }, [incidents, search, filter]);

  const activeCount = incidents.filter(i => i.status === 'active').length;

  if (selectedIncident) {
    return (
      <PageContainer>
        <IncidentDetailView incident={selectedIncident} onResolve={handleResolve} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Incidents"
        subtitle="Review service disruptions, track recovery timelines, and inspect root causes."
        actions={
          activeCount > 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/20 px-3 py-1.5 rounded-md">
              <AlertTriangle className="h-3.5 w-3.5" />
              {activeCount} Active Incident{activeCount > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-md">
              <CheckCircle className="h-3.5 w-3.5" /> All Services Normal
            </div>
          )
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Search by title or monitor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 w-full pl-8 pr-3 rounded-md border border-border bg-card text-xs text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
          />
        </div>

        <div className="flex items-center self-start sm:self-auto bg-card border border-border rounded-md p-0.5">
          {(['all', 'active', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors capitalize font-medium',
                filter === tab
                  ? 'bg-background text-text shadow-sm'
                  : 'text-muted hover:text-text'
              )}
            >
              {tab === 'all'
                ? `All (${incidents.length})`
                : tab === 'active'
                ? `Active (${activeCount})`
                : `Resolved (${incidents.length - activeCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-6 py-14 text-center">
          <CheckCircle className="h-8 w-8 text-success mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-text mb-1">No Incidents Found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {search
              ? 'No incidents match your current search terms.'
              : filter === 'active'
              ? 'Great news! There are no active disruptions across any of your monitored services.'
              : 'No resolved incidents recorded.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredIncidents.map(incident => (
            <div
              key={incident.id}
              className={cn(
                'bg-card border rounded-lg p-4 transition-all hover:bg-background/40',
                incident.status === 'active' ? 'border-danger/30 bg-danger/[0.02]' : 'border-border'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {incident.status === 'active' ? (
                      <XCircle className="h-4 w-4 text-danger" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/incidents/${incident.id}`}
                        className="text-sm font-medium text-text hover:text-primary transition-colors"
                      >
                        {incident.title}
                      </Link>
                      <Badge variant={incident.status === 'active' ? 'active' : 'resolved'}>
                        {incident.status === 'active' ? 'Active' : 'Resolved'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1 flex-wrap">
                      <span>
                        Resource:{' '}
                        <Link to={`/monitors/${incident.monitorId}`} className="text-text hover:underline">
                          {incident.monitorName}
                        </Link>
                      </span>
                      <span>·</span>
                      <span className="tabular">Started {formatRelativeTime(incident.startedAt)}</span>
                      {incident.duration && (
                        <>
                          <span>·</span>
                          <span className="tabular">Duration {formatDurationMinutes(incident.duration)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-shrink-0 self-start sm:self-center">
                  {incident.status === 'active' && (
                    <Button variant="secondary" size="sm" onClick={() => handleResolve(incident.id)}>
                      <Check className="h-3 w-3" /> Resolve
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={`/incidents/${incident.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
