import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, AlertTriangle, BarChart3,
  Globe, Settings, ChevronLeft, ChevronRight, User, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Monitors', to: '/monitors', icon: Activity },
  { label: 'Incidents', to: '/incidents', icon: AlertTriangle },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Status Pages', to: '/status-pages', icon: Globe, comingSoon: true },
];

function NestPingLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5 px-3 py-3 select-none', collapsed && 'justify-center')}>
      {/* Logo mark — a stylized radar/ping wave */}
      <div className="relative flex-shrink-0 h-7 w-7">
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
          <circle cx="14" cy="14" r="2.5" fill="#22D3EE"/>
          <circle cx="14" cy="14" r="6" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6"/>
          <circle cx="14" cy="14" r="10" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 3" opacity="0.3"/>
          <path d="M14 4 L14 7" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
          <path d="M24 14 L21 14" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
        </svg>
      </div>
      {!collapsed && (
        <div>
          <span className="text-sm font-semibold text-text tracking-tight">NestPing</span>
          <span className="block text-[10px] text-muted tracking-widest uppercase leading-none mt-0.5">Monitor</span>
        </div>
      )}
    </div>
  );
}

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isActive = item.to === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.to);

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      className={cn(
        'relative flex items-center gap-2.5 rounded-md text-sm transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        collapsed ? 'h-8 w-8 justify-center mx-auto' : 'h-8 px-2.5',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted hover:text-text hover:bg-border/50',
        item.comingSoon && 'opacity-80 hover:opacity-100',
      )}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.75} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.comingSoon && (
            <span className="text-[9px] font-medium tracking-wider text-primary/80 border border-primary/30 rounded px-1 py-0.5 uppercase leading-none">
              Preview
            </span>
          )}
        </>
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
      )}
    </NavLink>
  );
}

interface AppSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-card border-r border-border',
        'sidebar-transition',
        // Desktop
        collapsed ? 'lg:w-14' : 'lg:w-52',
        // Mobile
        mobileOpen ? 'w-52 translate-x-0' : 'w-52 -translate-x-full lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className="border-b border-border">
          <NestPingLogo collapsed={collapsed} />
        </div>

        {/* Mobile close */}
        <button
          className="absolute top-3 right-3 lg:hidden text-muted hover:text-text p-1 rounded"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <ul className="space-y-0.5" role="list">
            {navItems.map(item => (
              <li key={item.to}>
                <NavItemComponent item={item} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-2 py-3 space-y-1">
          {/* Settings */}
          <NavLink
            to="/settings"
            title={collapsed ? 'Settings' : undefined}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 rounded-md text-sm transition-colors duration-150 h-8',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              collapsed ? 'w-8 justify-center mx-auto' : 'px-2.5',
              isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted hover:text-text hover:bg-border/50',
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          {/* Free Plan */}
          {!collapsed && (
            <div className="mt-2 px-2.5 py-2 rounded-md bg-background border border-border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Free Plan</span>
                <span className="text-[10px] tabular text-muted">5 / 5</span>
              </div>
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-warning rounded-full w-full" />
              </div>
              <p className="text-[10px] text-muted mt-1.5">Monitor quota full</p>
            </div>
          )}

          {/* User */}
          <div className={cn(
            'flex items-center gap-2.5 rounded-md px-2 py-1.5 mt-1',
            collapsed && 'justify-center',
          )}>
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-text truncate">Alex Chen</p>
                <p className="text-[10px] text-muted truncate">alex@nestping.io</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          className={cn(
            'hidden lg:flex absolute -right-3 top-16 h-6 w-6 items-center justify-center',
            'bg-card border border-border rounded-full text-muted hover:text-text',
            'transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          )}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />
          }
        </button>
      </aside>

      {/* Spacer — push content right on desktop */}
      <div className={cn(
        'hidden lg:block flex-shrink-0 sidebar-transition',
        collapsed ? 'w-14' : 'w-52',
      )} />
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-1.5 rounded-md text-muted hover:text-text hover:bg-border/50"
      aria-label="Open navigation"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
