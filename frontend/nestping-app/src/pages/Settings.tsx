import { useState } from 'react';
import { 
  User, Bell, Sliders, Shield, Save, Key, 
  RefreshCw, Smartphone, Mail 
} from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { useMonitoring } from '@/context/MonitoringContext';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'notifications' | 'monitoring' | 'account';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { toast } = useToast();
  const { resetAllData } = useMonitoring();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    displayName: 'Alex Chen',
    email: 'alex@nestping.io',
    timezone: 'UTC+00:00 (London, Dublin)',
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    emailAddress: 'alex@nestping.io',
    telegramAlerts: true,
    telegramChatId: '@nestping_devops_alerts',
    downAlerts: true,
    recoveryAlerts: true,
    weeklyReport: false,
  });

  // Monitoring defaults
  const [monitoringDefaults, setMonitoringDefaults] = useState({
    defaultInterval: '300',
    failureThreshold: '2',
    timeout: '10',
    followRedirects: true,
  });

  const handleSave = (section: string) => {
    toast(`${section} settings saved successfully.`, 'success');
  };

  const handleResetData = () => {
    resetAllData();
    toast('Demo data has been reset to default state.', 'info');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'monitoring', label: 'Monitoring Defaults', icon: Sliders },
    { id: 'account', label: 'Account & Plan', icon: Shield },
  ] as const;

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, alert dispatch preferences, and monitoring defaults."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-card text-primary border border-border/80 shadow-sm'
                    : 'text-muted hover:text-text hover:bg-card/40'
                )}
              >
                <tab.icon className="h-3.5 w-3.5 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 max-w-2xl">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-card border border-border rounded-lg p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-text">Profile Information</h3>
                <p className="text-xs text-muted mt-0.5">Manage your personal identification details.</p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold text-base">
                  AC
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text">{profile.displayName}</h4>
                  <p className="text-xs text-muted">DevOps Lead</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  id="displayName"
                  label="Display Name"
                  value={profile.displayName}
                  onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))}
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                />
                <Select
                  id="timezone"
                  label="Timezone"
                  value={profile.timezone}
                  onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                >
                  <option value="UTC+00:00 (London, Dublin)">UTC+00:00 (London, Dublin)</option>
                  <option value="UTC-05:00 (New York, Eastern)">UTC-05:00 (New York, Eastern)</option>
                  <option value="UTC-08:00 (San Francisco, Pacific)">UTC-08:00 (San Francisco, Pacific)</option>
                  <option value="UTC+07:00 (Bangkok, Hanoi, Jakarta)">UTC+07:00 (Bangkok, Hanoi, Jakarta)</option>
                  <option value="UTC+09:00 (Tokyo, Seoul)">UTC+09:00 (Tokyo, Seoul)</option>
                </Select>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <Button size="sm" onClick={() => handleSave('Profile')}>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-lg p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-text">Notification Channels</h3>
                <p className="text-xs text-muted mt-0.5">Configure channels to receive real-time downtime and recovery alerts.</p>
              </div>

              {/* Email Alerts */}
              <div className="border border-border/80 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-text">Email Notifications</p>
                      <p className="text-[11px] text-muted">Receive alerts at your registered address</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={e => setNotifications(p => ({ ...p, emailAlerts: e.target.checked }))}
                    className="h-4 w-4 accent-primary rounded cursor-pointer"
                  />
                </div>
                {notifications.emailAlerts && (
                  <Input
                    id="notif-email"
                    placeholder="alerts@company.com"
                    value={notifications.emailAddress}
                    onChange={e => setNotifications(p => ({ ...p, emailAddress: e.target.value }))}
                  />
                )}
              </div>

              {/* Telegram Alerts */}
              <div className="border border-border/80 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-text">Telegram Alerts</p>
                      <p className="text-[11px] text-muted">Post alerts directly to a channel or bot chat</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.telegramAlerts}
                    onChange={e => setNotifications(p => ({ ...p, telegramAlerts: e.target.checked }))}
                    className="h-4 w-4 accent-primary rounded cursor-pointer"
                  />
                </div>
                {notifications.telegramAlerts && (
                  <Input
                    id="notif-telegram"
                    placeholder="@channel_name or chat ID"
                    value={notifications.telegramChatId}
                    onChange={e => setNotifications(p => ({ ...p, telegramChatId: e.target.value }))}
                  />
                )}
              </div>

              {/* Alert Triggers */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Alert Triggers</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.downAlerts}
                      onChange={e => setNotifications(p => ({ ...p, downAlerts: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-danger rounded cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-medium text-text">Downtime & Degradation alerts</p>
                      <p className="text-[11px] text-muted">Trigger immediate alert as soon as failure threshold is reached</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.recoveryAlerts}
                      onChange={e => setNotifications(p => ({ ...p, recoveryAlerts: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-success rounded cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-medium text-text">Recovery notifications</p>
                      <p className="text-[11px] text-muted">Notify when a down service returns to operational status</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <Button size="sm" onClick={() => handleSave('Notification')}>
                  <Save className="h-3.5 w-3.5" /> Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* MONITORING DEFAULTS TAB */}
          {activeTab === 'monitoring' && (
            <div className="bg-card border border-border rounded-lg p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-text">Monitoring Engine Defaults</h3>
                <p className="text-xs text-muted mt-0.5">Parameters applied to newly created monitors.</p>
              </div>

              <div className="space-y-4">
                <Select
                  id="defaultInterval"
                  label="Default Check Frequency"
                  value={monitoringDefaults.defaultInterval}
                  onChange={e => setMonitoringDefaults(p => ({ ...p, defaultInterval: e.target.value }))}
                >
                  <option value="60">Every 1 minute (Fastest)</option>
                  <option value="300">Every 5 minutes (Recommended)</option>
                  <option value="600">Every 10 minutes</option>
                  <option value="1800">Every 30 minutes</option>
                  <option value="3600">Every 1 hour</option>
                </Select>

                <Select
                  id="failureThreshold"
                  label="Failure Threshold (Consecutive failures before alert)"
                  value={monitoringDefaults.failureThreshold}
                  onChange={e => setMonitoringDefaults(p => ({ ...p, failureThreshold: e.target.value }))}
                >
                  <option value="1">1 failure (Immediate alert — sensitive)</option>
                  <option value="2">2 consecutive failures (Balanced)</option>
                  <option value="3">3 consecutive failures (Resistant to transient blips)</option>
                </Select>

                <Select
                  id="timeout"
                  label="Request Timeout"
                  value={monitoringDefaults.timeout}
                  onChange={e => setMonitoringDefaults(p => ({ ...p, timeout: e.target.value }))}
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds (Standard)</option>
                  <option value="30">30 seconds (Slow APIs)</option>
                </Select>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <Button size="sm" onClick={() => handleSave('Monitoring')}>
                  <Save className="h-3.5 w-3.5" /> Save Defaults
                </Button>
              </div>
            </div>
          )}

          {/* ACCOUNT & PLAN TAB */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              {/* Plan info */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text">Current Subscription</h3>
                    <p className="text-xs text-muted mt-0.5">Your organization's active tier and limits.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    Free Tier
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-background/50 border border-border rounded-md text-xs mb-4">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Monitors Quota</span>
                    <span className="font-semibold text-text tabular">5 / 5 Active</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Min Check Interval</span>
                    <span className="font-semibold text-text tabular">1 Minute</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Data Retention</span>
                    <span className="font-semibold text-text tabular">90 Days</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Status Pages</span>
                    <span className="font-semibold text-text">1 Public Page (Coming Soon)</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" onClick={() => toast('Upgrade portal will be available in v1.1.', 'info')}>
                    Upgrade to Pro Plan
                  </Button>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text">API Credentials</h3>
                    <p className="text-xs text-muted mt-0.5">Use your API token to programmatically trigger checks or query metrics.</p>
                  </div>
                  <Key className="h-4 w-4 text-muted" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="np_live_9f823a0b81e289c8932b109"
                    className="h-8 flex-1 rounded border border-border bg-background px-3 font-mono text-xs text-muted"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText('np_live_9f823a0b81e289c8932b109');
                      toast('API key copied to clipboard.', 'success');
                    }}
                  >
                    Copy Key
                  </Button>
                </div>
              </div>

              {/* Reset Demo Data */}
              <div className="bg-card border border-danger/20 rounded-lg p-5">
                <div className="flex items-start gap-3 justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-danger">Reset Prototype Data</h3>
                    <p className="text-xs text-muted mt-0.5">
                      Reset all monitors, incidents, and settings back to default mock state.
                    </p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setResetDialogOpen(true)}>
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset All Mock Data"
        description="Are you sure you want to reset all monitors, custom configurations, and incidents back to their default demo state?"
        confirmLabel="Reset Everything"
        variant="danger"
        onConfirm={handleResetData}
      />
    </PageContainer>
  );
}
