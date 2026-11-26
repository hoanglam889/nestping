import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Monitor, Incident, MonitorStatus } from '@/types';
import { monitors as initialMonitors, incidents as initialIncidents } from '@/data/mockData';
import { getAllMonitors } from '../services/monitorService.ts';

interface MonitoringStats {
  totalMonitors: number;
  operational: number;
  degraded: number;
  down: number;
  paused: number;
  avgUptime: number;
  avgResponseTime: number;
  activeIncidents: number;
  period30dUptime: number;
}

interface MonitoringContextType {
  monitors: Monitor[];
  incidents: Incident[];
  stats: MonitoringStats;
  addMonitor: (monitor: Monitor) => void;
  updateMonitor: (monitor: Monitor) => void;
  deleteMonitor: (id: string) => void;
  togglePauseMonitor: (id: string) => void;
  triggerManualCheck: (id: string) => void;
  resolveIncident: (id: string) => void;
  resetAllData: () => void;
}

const MonitoringContext = createContext<MonitoringContextType | null>(null);

const STORAGE_KEY_MONITORS = 'nestping_monitors_v1';
const STORAGE_KEY_INCIDENTS = 'nestping_incidents_v1';

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [monitors, setMonitors] = useState<Monitor[]>([]);

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialIncidents;
  });

    // Tải danh sách monitors từ MySQL Backend
  useEffect(() => {
    getAllMonitors()
      .then((data: any) => {
        // Chuyển đổi dữ liệu từ Backend sang format Frontend hiển thị
        const formatted = (data || []).map((item: any) => ({
          id: String(item.id),
          name: item.name,
          url: item.url,
          status: item.status === 'UP' ? 'operational' : item.status === 'DOWN' ? 'down' : item.status === 'PAUSED' ? 'paused' : 'operational',
          responseTime: 0,
          uptime: 100,
          checkInterval: item.checkInterval || 60,
          lastChecked: item.lastCheckedAt || new Date().toISOString(),
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setMonitors(formatted);
      })
      .catch((err: any) => {
        console.error('Lỗi khi tải monitors từ Backend:', err);
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    } catch {
      // ignore
    }
  }, [incidents]);

  const addMonitor = (newMon: Monitor) => {
    setMonitors(prev => [newMon, ...prev]);
  };

  const updateMonitor = (updated: Monitor) => {
    setMonitors(prev => prev.map(m => (m.id === updated.id ? updated : m)));
    // Also update incidents monitorName if changed
    setIncidents(prev =>
      prev.map(i => (i.monitorId === updated.id ? { ...i, monitorName: updated.name } : i))
    );
  };

  const deleteMonitor = (id: string) => {
    setMonitors(prev => prev.filter(m => m.id !== id));
  };

  const togglePauseMonitor = (id: string) => {
    setMonitors(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const newStatus: MonitorStatus = m.status === 'paused' ? 'operational' : 'paused';
        return {
          ...m,
          status: newStatus,
          lastChecked: new Date().toISOString(),
        };
      })
    );
  };

  const triggerManualCheck = (id: string) => {
    setMonitors(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        return {
          ...m,
          lastChecked: new Date().toISOString(),
          responseTime: m.status === 'down' ? 0 : Math.round(150 + Math.random() * 200),
        };
      })
    );
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== id) return inc;
        const now = new Date().toISOString();
        return {
          ...inc,
          status: 'resolved',
          resolvedAt: now,
          duration: Math.max(1, Math.round((Date.now() - new Date(inc.startedAt).getTime()) / 60000)),
          timeline: [
            ...inc.timeline,
            {
              id: `evt-res-${Date.now()}`,
              type: 'recovery_detected',
              timestamp: now,
              message: 'Service check succeeded with HTTP 200.',
            },
            {
              id: `evt-res-final-${Date.now()}`,
              type: 'incident_resolved',
              timestamp: now,
              message: 'Manual confirmation or automated health check resolved incident.',
            },
          ],
        };
      })
    );
  };

  const resetAllData = () => {
    setMonitors(initialMonitors);
    setIncidents(initialIncidents);
    localStorage.removeItem(STORAGE_KEY_MONITORS);
    localStorage.removeItem(STORAGE_KEY_INCIDENTS);
  };

  // Dynamic calculations
  const operational = monitors.filter(m => m.status === 'operational').length;
  const degraded = monitors.filter(m => m.status === 'degraded').length;
  const down = monitors.filter(m => m.status === 'down').length;
  const paused = monitors.filter(m => m.status === 'paused').length;

  const activeIncidents = incidents.filter(i => i.status === 'active').length;

  const validUptimeMonitors = monitors.filter(m => m.status !== 'paused');
  const avgUptime =
    validUptimeMonitors.length > 0
      ? Number(
          (
            validUptimeMonitors.reduce((acc, m) => acc + m.uptime, 0) / validUptimeMonitors.length
          ).toFixed(2)
        )
      : 100;

  const activeResponseMonitors = monitors.filter(
    m => m.status === 'operational' || m.status === 'degraded'
  );
  const avgResponseTime =
    activeResponseMonitors.length > 0
      ? Math.round(
          activeResponseMonitors.reduce((acc, m) => acc + m.responseTime, 0) /
            activeResponseMonitors.length
        )
      : 248;

  const stats: MonitoringStats = {
    totalMonitors: monitors.length,
    operational,
    degraded,
    down,
    paused,
    avgUptime,
    avgResponseTime,
    activeIncidents,
    period30dUptime: 99.94,
  };

  return (
    //MonitoringContext.Provider gói cục value và phát đi
    <MonitoringContext.Provider
      value={{
        monitors,
        incidents,
        stats,
        addMonitor,
        updateMonitor,
        deleteMonitor,
        togglePauseMonitor,
        triggerManualCheck,
        resolveIncident,
        resetAllData,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}
