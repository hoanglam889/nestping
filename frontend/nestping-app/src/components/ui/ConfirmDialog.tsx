import { Dialog } from './Dialog';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = 'Confirm', onConfirm, variant = 'default'
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'default'}
            size="md"
            onClick={() => { onConfirm(); onOpenChange(false); }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        {variant === 'danger' && (
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-danger/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-danger" />
          </div>
        )}
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </Dialog>
  );
}
