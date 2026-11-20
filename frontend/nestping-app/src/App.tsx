import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/Toast';
import { MonitoringProvider } from '@/context/MonitoringContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewPage } from '@/pages/Overview';
import { MonitorsPage } from '@/pages/Monitors';
import { MonitorDetailPage } from '@/pages/MonitorDetail';
import { IncidentsPage } from '@/pages/Incidents';
import { AnalyticsPage } from '@/pages/Analytics';
import { SettingsPage } from '@/pages/Settings';
import { StatusPagesPage } from '@/pages/StatusPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MonitoringProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/monitors" element={<MonitorsPage />} />
                <Route path="/monitors/:id" element={<MonitorDetailPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/incidents/:id" element={<IncidentsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/status-pages" element={<StatusPagesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </MonitoringProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
