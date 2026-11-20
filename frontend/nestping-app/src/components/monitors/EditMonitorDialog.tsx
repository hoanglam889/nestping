import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { isValidUrl } from '@/lib/utils';
import type { Monitor, CheckInterval } from '@/types';

interface EditMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitor: Monitor | null;
  onSave: (monitor: Monitor) => void;
}

export function EditMonitorDialog({ open, onOpenChange, monitor, onSave }: EditMonitorDialogProps) {
  const [form, setForm] = useState({ name: '', url: '', checkInterval: '300' });
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (monitor) {
      setForm({ name: monitor.name, url: monitor.url, checkInterval: String(monitor.checkInterval) });
    }
  }, [monitor]);

  const validate = (): boolean => {
    const errs: { name?: string; url?: string } = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!isValidUrl(form.url)) errs.url = 'Enter a valid https:// or http:// URL.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !monitor) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300));
    onSave({ ...monitor, name: form.name.trim(), url: form.url.trim(), checkInterval: parseInt(form.checkInterval) as CheckInterval });
    setSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Monitor"
      description="Update the configuration for this monitor."
      footer={
        <>
          <Button variant="secondary" size="md" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="md" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="edit-name" label="Monitor name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} />
        <Input id="edit-url" label="URL" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} error={errors.url} />
        <Select id="edit-interval" label="Check interval" value={form.checkInterval} onChange={e => setForm(p => ({ ...p, checkInterval: e.target.value }))}>
          <option value="60">Every 1 minute</option>
          <option value="300">Every 5 minutes</option>
          <option value="600">Every 10 minutes</option>
          <option value="1800">Every 30 minutes</option>
          <option value="3600">Every hour</option>
        </Select>
      </form>
    </Dialog>
  );
}
