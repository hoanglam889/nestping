import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
}
