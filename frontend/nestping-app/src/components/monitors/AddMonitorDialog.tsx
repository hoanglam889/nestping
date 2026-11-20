import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { isValidUrl, generateId } from '@/lib/utils';
import type { Monitor, CheckInterval } from '@/types';

interface AddMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (monitor: Monitor) => void;
}

interface FormState {
  name: string;
  url: string;
  checkInterval: string;
}

interface FormErrors {
  name?: string;
  url?: string;
}

export function AddMonitorDialog({ open, onOpenChange, onAdd }: AddMonitorDialogProps) {
  const [form, setForm] = useState<FormState>({ name: '', url: 'https://', checkInterval: '300' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Monitor name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.url.trim()) errs.url = 'URL is required.';
    else if (!isValidUrl(form.url)) errs.url = 'Enter a valid URL starting with https:// or http://';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate async
    await new Promise(r => setTimeout(r, 400));
    onAdd({
      id: `mon-${generateId()}`,
      name: form.name.trim(),
      url: form.url.trim(),
      status: 'operational',
      responseTime: Math.round(200 + Math.random() * 300),
      uptime: 100,
      checkInterval: parseInt(form.checkInterval) as CheckInterval,
      lastChecked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    setForm({ name: '', url: 'https://', checkInterval: '300' });
    setErrors({});
    setSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setForm({ name: '', url: 'https://', checkInterval: '300' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title="Add Monitor"
      description="Configure a new uptime check for your website or API."
      footer={
        <>
          <Button variant="secondary" size="md" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button size="md" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Monitor'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="monitor-name"
          label="Monitor name"
          description="A descriptive name to identify this monitor."
          placeholder="e.g. Production API"
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          id="monitor-url"
          label="URL"
          description="The endpoint to monitor. Must be publicly reachable."
          placeholder="https://api.example.com/health"
          value={form.url}
          onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
          error={errors.url}
        />
        <Select
          id="monitor-interval"
          label="Check interval"
          value={form.checkInterval}
          onChange={e => setForm(p => ({ ...p, checkInterval: e.target.value }))}
        >
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
