import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'active' | 'resolved';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      variant === 'default' && 'bg-muted/10 text-muted border-muted/20',
      variant === 'active' && 'bg-danger/10 text-danger border-danger/20',
      variant === 'resolved' && 'bg-success/10 text-success border-success/20',
      className
    )}>
      {children}
    </span>
  );
}
