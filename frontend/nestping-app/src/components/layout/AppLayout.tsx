import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

const breadcrumbMap: Record<string, string> = {
  '/': 'Overview',
  '/monitors': 'Monitors',
  '/incidents': 'Incidents',
  '/analytics': 'Analytics',
  '/status-pages': 'Status Pages',
  '/settings': 'Settings',
};

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Determine breadcrumb
  const path = '/' + location.pathname.split('/')[1];
  const breadcrumb = breadcrumbMap[path] || 'Overview';

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          onMobileMenuOpen={() => setMobileOpen(true)}
          breadcrumb={breadcrumb}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
