import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { MobileMenuButton } from './AppSidebar';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onMobileMenuOpen: () => void;
  breadcrumb?: string;
}

export function AppHeader({ onMobileMenuOpen, breadcrumb }: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-12 flex items-center px-4 md:px-6 gap-3 bg-background border-b border-border">
      {/* Mobile menu */}
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted">NestPing</span>
          <span className="text-border">/</span>
          <span className="text-text font-medium">{breadcrumb}</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-1">
        {searchOpen ? (
          <input
            autoFocus
            type="search"
            placeholder="Search monitors, incidents..."
            className={cn(
              'h-7 w-56 rounded-md border border-border bg-card px-3 text-xs text-text placeholder:text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
            )}
            onBlur={() => setSearchOpen(false)}
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 rounded-md text-muted hover:text-text hover:bg-border/50 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          className="p-1.5 rounded-md text-muted hover:text-text hover:bg-border/50 transition-colors relative"
          aria-label="Notifications — 2 unread"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
        </button>
      </div>

      {/* User menu */}
      <button className="flex items-center gap-1.5 h-7 pl-1 pr-2 rounded-md hover:bg-border/50 transition-colors" aria-label="User menu">
        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-[9px] font-semibold text-primary">AC</span>
        </div>
        <ChevronDown className="h-3 w-3 text-muted" />
      </button>
    </header>
  );
}
