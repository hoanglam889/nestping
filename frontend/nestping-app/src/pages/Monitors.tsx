import { useState } from 'react';
import { Plus, AlertTriangle, Activity } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { MonitorTable } from '@/components/monitors/MonitorTable';
import { AddMonitorDialog } from '@/components/monitors/AddMonitorDialog';
import { EditMonitorDialog } from '@/components/monitors/EditMonitorDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import type { Monitor } from '@/types';

const MAX_MONITORS = 5;

export function MonitorsPage() {
  const { monitors, addMonitor, updateMonitor, deleteMonitor, togglePauseMonitor } = useMonitoring();
  const [addOpen, setAddOpen] = useState(false);
  const [editMonitor, setEditMonitor] = useState<Monitor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Monitor | null>(null);
  const { toast } = useToast();

  const handleAdd = (monitor: Monitor) => {
    if (monitors.length >= MAX_MONITORS) {
      toast('Monitor quota reached. Upgrade your plan to add more monitors.', 'error');
      return;
    }
    addMonitor(monitor);
    toast(`"${monitor.name}" added and monitoring started.`, 'success');
  };

  const handleEdit = (monitor: Monitor) => {
    updateMonitor(monitor);
    toast(`"${monitor.name}" updated.`, 'success');
  };

  const handleDelete = (monitor: Monitor) => {
    deleteMonitor(monitor.id);
    toast(`"${monitor.name}" deleted.`, 'info');
  };

  const handleTogglePause = (monitor: Monitor) => {
    togglePauseMonitor(monitor.id);
    const willPause = monitor.status !== 'paused';
    toast(
      willPause
        ? `"${monitor.name}" paused. No checks will run.`
        : `"${monitor.name}" resumed. Monitoring is active.`,
      'info'
    );
  };

  const usedQuota = monitors.length;
  const quotaFull = usedQuota >= MAX_MONITORS;

  return (
    <PageContainer>
      <PageHeader
        title="Monitors"
        subtitle="Manage and monitor your websites and services."
        actions={
          <Button
            size="md"
            onClick={() => setAddOpen(true)}
            disabled={quotaFull}
            title={quotaFull ? 'Monitor quota reached. Upgrade to add more.' : undefined}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Monitor
          </Button>
        }
      />

      {/* Quota */}
      <div className="bg-card border border-border rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-medium text-text">Free Plan</span>
            <span className="text-xs text-muted ml-2">· {usedQuota} of {MAX_MONITORS} monitors used</span>
          </div>
          {quotaFull && (
            <div className="flex items-center gap-1.5 text-xs text-warning">
              <AlertTriangle className="h-3 w-3" />
              Quota full
            </div>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${quotaFull ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${Math.min(100, (usedQuota / MAX_MONITORS) * 100)}%` }}
          />
        </div>
        {quotaFull && (
          <p className="text-xs text-muted mt-2">
            You've reached your free tier limit of 5 monitors. Delete a monitor or upgrade to add more.
          </p>
        )}
      </div>

      {monitors.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-10 w-10 opacity-30 text-muted" />}
          title="No monitors yet"
          description="Add your first monitor to start tracking uptime and response time."
          action={
            <Button size="md" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add your first monitor
            </Button>
          }
        />
      ) : (
        <MonitorTable
          monitors={monitors}
          onEdit={setEditMonitor}
          onDelete={setDeleteTarget}
          onTogglePause={handleTogglePause}
          showSearch
        />
      )}

      <AddMonitorDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />
      <EditMonitorDialog
        open={!!editMonitor}
        onOpenChange={(open) => !open && setEditMonitor(null)}
        monitor={editMonitor}
        onSave={handleEdit}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Monitor"
        description={`Delete "${deleteTarget?.name}"? This will permanently remove the monitor and all its check history. This action cannot be undone.`}
        confirmLabel="Delete Monitor"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        variant="danger"
      />
    </PageContainer>
  );
}
