import { useState } from 'react';
import { 
  Globe, CheckCircle, AlertTriangle, ArrowRight, 
  Sparkles, Bell 
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import { formatUptime } from '@/lib/utils';

export function StatusPagesPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();
  const { monitors } = useMonitoring();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    toast('You have been added to the early access list for Status Pages!', 'success');
  };

  const hasOutage = monitors.some(m => m.status === 'down');
  const hasDegraded = monitors.some(m => m.status === 'degraded');

  return (
    <PageContainer>
      <PageHeader
        title="Status Pages"
        subtitle="Publish real-time system reliability and incident updates to build customer trust."
      />

      {/* Hero explanation card */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8 relative overflow-hidden">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 mb-3">
            <Sparkles className="h-3 w-3" /> Coming in Q2
          </div>
          <h2 className="text-lg font-semibold text-text mb-2">
            Branded Public & Private Status Pages
          </h2>
          <p className="text-xs text-muted leading-relaxed mb-5">
            Keep your users informed automatically during incidents. Connect custom domains, 
            display live component statuses, showcase your 90-day SLA reliability, and allow customers 
            to subscribe to email & webhook notifications.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter work email for early access"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-8 flex-1 rounded-md border border-border bg-background px-3 text-xs text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm">
                Join Waitlist <ArrowRight className="h-3 w-3" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 px-3 py-2 rounded-md max-w-md">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>You're on the early access list! We'll notify you as soon as preview opens.</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Mock Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Live Preview · status.acme-corp.com
          </span>
          <span className="text-[11px] text-muted flex items-center gap-1">
            <Globe className="h-3 w-3 text-primary" /> Previewing customer-facing layout
          </span>
        </div>

        {/* Public Status Page Simulation Shell */}
        <div className="bg-[#090D16] border border-border rounded-xl p-6 sm:p-8 max-w-4xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                NP
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">NestPing Cloud Services</h3>
                <p className="text-[11px] text-muted">Real-time status and historical uptime</p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={() => toast('Subscription form simulation triggered.', 'info')}>
              <Bell className="h-3.5 w-3.5" /> Subscribe to Updates
            </Button>
          </div>

          {/* Global Status Banner */}
          <div className="my-6">
            {hasOutage ? (
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-danger">Partial Service Outage</h4>
                  <p className="text-[11px] text-muted mt-0.5">We are currently investigating issues with payment processing services.</p>
                </div>
              </div>
            ) : hasDegraded ? (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-warning">Degraded System Performance</h4>
                  <p className="text-[11px] text-muted mt-0.5">Some components are currently experiencing elevated response latency.</p>
                </div>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-success">All Systems Operational</h4>
                  <p className="text-[11px] text-muted mt-0.5">All monitored endpoints and services are operating normally with no known issues.</p>
                </div>
              </div>
            )}
          </div>

          {/* Component list */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between text-xs font-medium text-muted px-1">
              <span>System Component</span>
              <span>Status</span>
            </div>

            <div className="border border-border rounded-lg divide-y divide-border bg-card/60">
              {monitors.map(m => (
                <div key={m.id} className="p-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-text block">{m.name}</span>
                    <span className="text-[10px] text-muted font-mono">{m.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] tabular text-muted hidden sm:inline">
                      {formatUptime(m.uptime)} uptime
                    </span>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Incidents Summary */}
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              Past Incidents
            </h4>
            <div className="space-y-2 text-xs">
              <div className="border-l-2 border-border pl-3 py-1">
                <p className="text-[11px] text-muted tabular">November 17, 2026</p>
                <p className="font-medium text-text mt-0.5">NestPing API Performance Blip</p>
                <p className="text-[11px] text-muted mt-0.5">Resolved — Automated failover rerouted traffic successfully within 4 minutes.</p>
              </div>
              <div className="border-l-2 border-border pl-3 py-1">
                <p className="text-[11px] text-muted tabular">November 12, 2026</p>
                <p className="font-medium text-text mt-0.5">Scheduled Database Maintenance</p>
                <p className="text-[11px] text-muted mt-0.5">Completed — Maintenance window concluded with zero customer disruption.</p>
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <span>Powered by NestPing</span>
            <span>Uptime SLA Verified</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
