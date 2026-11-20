import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, footer, className }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-md bg-card border border-border rounded-lg shadow-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          className
        )}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <RadixDialog.Title className="text-sm font-semibold text-text">{title}</RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="text-xs text-muted mt-0.5">{description}</RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close className="rounded p-1 text-muted hover:text-text hover:bg-border/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </RadixDialog.Close>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
