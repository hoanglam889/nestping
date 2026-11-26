import { useEffect, useState } from 'react';
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
import type { Monitor } from '@/types';
import { getAllMonitors, createMonitor, deleteMonitor, updateMonitor, togglePauseMonitor } from '@/services/monitorService';

const MAX_MONITORS = 5;

export function MonitorsPage() {
  // State lưu danh sách monitors
  const [monitors, setMonitors] = useState<any[]>([]);
  
  // 1. Hàm tải dữ liệu từ MySQL Backend
  const loadData = () => {
    getAllMonitors()
      .then((data: any) => {
        // Chuẩn hóa dữ liệu để Bảng có đủ cột hiển thị
        const statusMap: Record<string, string> = {
          UP: 'operational',
          DOWN: 'down',
          PAUSED: 'paused',
        };
        const formatted = (data || []).map((item: any) => ({
          id: String(item.id),
          name: item.name,
          url: item.url,
          // Chuyển đổi trạng thái từ Backend sang UI
          status: statusMap[item.status] ?? 'operational',
          responseTime: 120, // Số ms mặc định
          uptime: 99.9,      // Uptime mặc định
          checkInterval: item.checkInterval || 60,
          lastChecked: item.lastCheckedAt || new Date().toISOString(),
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setMonitors(formatted);
      })
      .catch((err) => console.error('Lỗi tải monitors:', err));
  };

  // 2. Tự động gọi khi vừa vào trang
  useEffect(() => {
    loadData();
  }, []);

  const [addOpen, setAddOpen] = useState(false);
  const [editMonitor, setEditMonitor] = useState<Monitor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Monitor | null>(null);
  const { toast } = useToast();

  // Hàm xử lý thêm monitor (Gọi API xong kéo lại bảng bằng loadData)
  const handleAdd = async (newMonitor: any) => {
    try {
      await createMonitor({
        name: newMonitor.name,
        url: newMonitor.url,
        userId: "1", // Tạm thời gán user ID 1
        checkInterval: Number(newMonitor.checkInterval) || 60,
        status: 'UP',
      });

      // Tải lại bảng ngay lập tức
      loadData();
      toast(`"${newMonitor.name}" đã được thêm vào hệ thống!`, 'success');
    } catch (error) {
      console.error('Lỗi khi thêm monitor:', error);
      toast('Không thể thêm monitor. Vui lòng thử lại!', 'error');
    }
  };

  const handleEdit = async (monitor: any) => {
    try {
      await updateMonitor(monitor.id, {
        name: monitor.name,
        url: monitor.url,
        checkInterval: Number(monitor.checkInterval) || 60,
      });
      
      loadData();
      toast(`"${monitor.name}" đã được cập nhật!`, 'success');
    } catch(error) {
      console.error('Lỗi khi cập nhật monitor:', error);
      toast('Không thể cập nhật monitor. Vui lòng thử lại!', 'error');
    }
  };

  //Hàm xóa cứng(xóa luôn web ko cần theo dõi)
  const handleDelete = async (monitor: any) => {
    try {
      await deleteMonitor(monitor.id);
      loadData();
      toast(`"${monitor.name}" đã được xóa khỏi hệ thống!`, 'success');
    } catch(error) {
    console.error('Lỗi khi thêm monitor:', error);
    toast('Không thể thêm monitor. Vui lòng thử lại!', 'error');
    }
  };

  const handleTogglePause = async (monitor: any) => {
   try {
    await togglePauseMonitor(monitor.id);
    await loadData();
     toast(`Monitor ${monitor.status === 'paused' ? 'đã tiếp tục' : 'đã tạm dừng'}!`, 'success');
   } catch (error) {
    console.error('Lỗi khi toggle pause:', error);
    toast('Không thể thay đổi trạng thái. Vui lòng thử lại!', 'error');
   }
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
