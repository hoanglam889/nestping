import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, description, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-text">
            {label}
          </label>
        )}
        {description && <p className="text-xs text-muted">{description}</p>}
        <input
          id={id}
          ref={ref}
          className={cn(
            'h-8 w-full rounded-md border bg-background px-3 text-sm text-text placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error ? 'border-danger focus:ring-danger' : 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
