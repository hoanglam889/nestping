import { useState, useMemo } from 'react';
import {
  ArrowUpDown, MoreHorizontal, Pause, Play, Pencil, Trash2,
  ExternalLink, ChevronUp, ChevronDown, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn, formatResponseTime, formatRelativeTime, formatUptime, formatCheckInterval } from '@/lib/utils';
import type { Monitor, MonitorStatus, SortState } from '@/types';

interface MonitorTableProps {
  monitors: Monitor[];
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
  onTogglePause: (monitor: Monitor) => void;
  showSearch?: boolean;
}

type SortField = 'name' | 'status' | 'responseTime' | 'uptime' | 'lastChecked';

function SortIcon({ field, sort }: { field: SortField; sort: SortState }) {
  if (sort.field !== field) return <ArrowUpDown className="h-3 w-3 ml-1 text-muted opacity-50" />;
  return sort.direction === 'asc'
    ? <ChevronUp className="h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="h-3 w-3 ml-1 text-primary" />;
}

function MonitorActions({ monitor, onEdit, onDelete, onTogglePause }: {
  monitor: Monitor;
  onEdit: (m: Monitor) => void;
  onDelete: (m: Monitor) => void;
  onTogglePause: (m: Monitor) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="h-6 w-6 flex items-center justify-center rounded text-muted hover:text-text hover:bg-border/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Actions for ${monitor.name}`}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-card border border-border rounded-lg shadow-xl py-1 min-w-[150px] z-50"
          sideOffset={4}
          align="end"
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-text hover:bg-border/50 cursor-pointer focus:outline-none focus:bg-border/50"
            onSelect={() => onEdit(monitor)}
          >
            <Pencil className="h-3 w-3 text-muted" /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-text hover:bg-border/50 cursor-pointer focus:outline-none focus:bg-border/50"
            onSelect={() => onTogglePause(monitor)}
          >
            {monitor.status === 'paused'
              ? <><Play className="h-3 w-3 text-muted" /> Resume</>
              : <><Pause className="h-3 w-3 text-muted" /> Pause</>
            }
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-border my-1" />
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-danger hover:bg-danger/10 cursor-pointer focus:outline-none focus:bg-danger/10"
            onSelect={() => onDelete(monitor)}
          >
            <Trash2 className="h-3 w-3" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MonitorTable({ monitors, onEdit, onDelete, onTogglePause, showSearch = false }: MonitorTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MonitorStatus | 'all'>('all');
  const [sort, setSort] = useState<SortState>({ field: 'name', direction: 'asc' });

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filtered = useMemo(() => {
    let result = [...monitors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'name') cmp = a.name.localeCompare(b.name);
      else if (sort.field === 'status') cmp = a.status.localeCompare(b.status);
      else if (sort.field === 'responseTime') cmp = a.responseTime - b.responseTime;
      else if (sort.field === 'uptime') cmp = a.uptime - b.uptime;
      else if (sort.field === 'lastChecked') cmp = new Date(a.lastChecked).getTime() - new Date(b.lastChecked).getTime();
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [monitors, search, statusFilter, sort]);

  const thCls = 'px-3 py-2 text-left text-[10px] font-medium text-muted uppercase tracking-wider whitespace-nowrap';
  const tdCls = 'px-3 py-2.5 text-sm';

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {showSearch && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search monitors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-7 w-full pl-8 pr-3 rounded-md border border-border bg-background text-xs text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as MonitorStatus | 'all')}
            className="h-7 rounded-md border border-border bg-background pl-2.5 pr-7 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="all">All status</option>
            <option value="operational">Operational</option>
            <option value="degraded">Degraded</option>
            <option value="down">Down</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className={thCls}>
                <button className="inline-flex items-center hover:text-text" onClick={() => handleSort('name')}>
                  Monitor <SortIcon field="name" sort={sort} />
                </button>
              </th>
              <th className={cn(thCls, 'hidden sm:table-cell')}>URL</th>
              <th className={thCls}>
                <button className="inline-flex items-center hover:text-text" onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" sort={sort} />
                </button>
              </th>
              <th className={cn(thCls, 'hidden md:table-cell')}>
                <button className="inline-flex items-center hover:text-text" onClick={() => handleSort('responseTime')}>
                  Response <SortIcon field="responseTime" sort={sort} />
                </button>
              </th>
              <th className={cn(thCls, 'hidden md:table-cell')}>
                <button className="inline-flex items-center hover:text-text" onClick={() => handleSort('uptime')}>
                  Uptime <SortIcon field="uptime" sort={sort} />
                </button>
              </th>
              <th className={cn(thCls, 'hidden lg:table-cell')}>Interval</th>
              <th className={cn(thCls, 'hidden lg:table-cell')}>
                <button className="inline-flex items-center hover:text-text" onClick={() => handleSort('lastChecked')}>
                  Last Check <SortIcon field="lastChecked" sort={sort} />
                </button>
              </th>
              <th className={cn(thCls, 'w-10')}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted">
                  No monitors match your filter.
                </td>
              </tr>
            ) : filtered.map(monitor => (
              <tr key={monitor.id} className="hover:bg-background/40 transition-colors group">
                <td className={tdCls}>
                  <Link
                    to={`/monitors/${monitor.id}`}
                    className="font-medium text-text hover:text-primary transition-colors"
                  >
                    {monitor.name}
                  </Link>
                </td>
                <td className={cn(tdCls, 'hidden sm:table-cell')}>
                  <a
                    href={monitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-muted hover:text-text text-xs font-mono max-w-[180px] truncate"
                  >
                    {monitor.url.replace(/^https?:\/\//, '')}
                    <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100" />
                  </a>
                </td>
                <td className={tdCls}>
                  <StatusBadge status={monitor.status} />
                </td>
                <td className={cn(tdCls, 'hidden md:table-cell tabular text-text text-xs')}>
                  <span className={monitor.status === 'down' ? 'text-danger' : monitor.responseTime > 800 ? 'text-warning' : 'text-text'}>
                    {formatResponseTime(monitor.responseTime)}
                  </span>
                </td>
                <td className={cn(tdCls, 'hidden md:table-cell tabular text-xs')}>
                  <span className={monitor.uptime >= 99.9 ? 'text-success' : monitor.uptime >= 99 ? 'text-warning' : 'text-danger'}>
                    {formatUptime(monitor.uptime)}
                  </span>
                </td>
                <td className={cn(tdCls, 'hidden lg:table-cell text-xs text-muted')}>
                  {formatCheckInterval(monitor.checkInterval)}
                </td>
                <td className={cn(tdCls, 'hidden lg:table-cell text-xs text-muted tabular')}>
                  {formatRelativeTime(monitor.lastChecked)}
                </td>
                <td className={cn(tdCls, 'text-right')}>
                  <MonitorActions
                    monitor={monitor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePause={onTogglePause}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
