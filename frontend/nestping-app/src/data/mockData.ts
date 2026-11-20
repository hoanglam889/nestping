import type {
  Monitor,
  Incident,
  CheckResult,
  ResponseDataPoint,
  UptimePeriod,
} from '@/types';

// ─── Monitors ───────────────────────────────────────────────────────────────

export const monitors: Monitor[] = [
  {
    id: 'mon-1',
    name: 'NestPing API',
    url: 'https://api.nestping.io/health',
    status: 'operational',
    responseTime: 198,
    uptime: 99.97,
    checkInterval: 60,
    lastChecked: new Date(Date.now() - 42 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mon-2',
    name: 'Main Website',
    url: 'https://nestping.io',
    status: 'operational',
    responseTime: 312,
    uptime: 99.91,
    checkInterval: 300,
    lastChecked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mon-3',
    name: 'Documentation',
    url: 'https://docs.nestping.io',
    status: 'degraded',
    responseTime: 1240,
    uptime: 99.42,
    checkInterval: 300,
    lastChecked: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mon-4',
    name: 'Payment Service',
    url: 'https://pay.nestping.io/status',
    status: 'down',
    responseTime: 0,
    uptime: 98.76,
    checkInterval: 60,
    lastChecked: new Date(Date.now() - 55 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mon-5',
    name: 'Customer Portal',
    url: 'https://portal.nestping.io',
    status: 'paused',
    responseTime: 445,
    uptime: 99.88,
    checkInterval: 600,
    lastChecked: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Incidents ───────────────────────────────────────────────────────────────

export const incidents: Incident[] = [
  {
    id: 'inc-1',
    monitorId: 'mon-4',
    monitorName: 'Payment Service',
    title: 'Payment Service Unreachable',
    status: 'active',
    startedAt: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 'evt-1-1',
        type: 'failure_detected',
        timestamp: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
        message: 'Connection refused on HTTPS port 443. No response received.',
      },
      {
        id: 'evt-1-2',
        type: 'threshold_reached',
        timestamp: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
        message: 'Failure threshold reached (2 consecutive failures). Incident triggered.',
      },
      {
        id: 'evt-1-3',
        type: 'incident_created',
        timestamp: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
        message: 'Incident created. Notifications sent via email.',
      },
    ],
  },
  {
    id: 'inc-2',
    monitorId: 'mon-3',
    monitorName: 'Documentation',
    title: 'Documentation Site Slow Response',
    status: 'active',
    startedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 'evt-2-1',
        type: 'failure_detected',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        message: 'Response time 1240ms exceeds degradation threshold (800ms).',
      },
      {
        id: 'evt-2-2',
        type: 'threshold_reached',
        timestamp: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
        message: 'Degradation threshold reached. Status set to Degraded.',
      },
      {
        id: 'evt-2-3',
        type: 'incident_created',
        timestamp: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
        message: 'Incident created for degraded performance.',
      },
    ],
  },
  {
    id: 'inc-3',
    monitorId: 'mon-1',
    monitorName: 'NestPing API',
    title: 'NestPing API Timeout',
    status: 'resolved',
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 128,
    timeline: [
      {
        id: 'evt-3-1',
        type: 'failure_detected',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
        message: 'Request timed out after 10s. No response received.',
      },
      {
        id: 'evt-3-2',
        type: 'threshold_reached',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 119 * 60 * 1000).toISOString(),
        message: 'Failure threshold reached (3 consecutive failures).',
      },
      {
        id: 'evt-3-3',
        type: 'incident_created',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 119 * 60 * 1000).toISOString(),
        message: 'Incident created. Alert notifications sent.',
      },
      {
        id: 'evt-3-4',
        type: 'recovery_detected',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(),
        message: 'Successful response received. HTTP 200 in 210ms.',
      },
      {
        id: 'evt-3-5',
        type: 'incident_resolved',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Service confirmed operational. Incident resolved after 128 minutes.',
      },
    ],
  },
  {
    id: 'inc-4',
    monitorId: 'mon-2',
    monitorName: 'Main Website',
    title: 'Main Website SSL Certificate Warning',
    status: 'resolved',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    timeline: [
      {
        id: 'evt-4-1',
        type: 'failure_detected',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(),
        message: 'SSL certificate check failed. Certificate expires in 2 days.',
      },
      {
        id: 'evt-4-2',
        type: 'incident_created',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(),
        message: 'SSL warning incident created.',
      },
      {
        id: 'evt-4-3',
        type: 'recovery_detected',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(),
        message: 'SSL certificate renewed. Certificate valid for 90 days.',
      },
      {
        id: 'evt-4-4',
        type: 'incident_resolved',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Incident resolved after 60 minutes.',
      },
    ],
  },
];

// ─── Check Results ────────────────────────────────────────────────────────────

export const checkResults: CheckResult[] = [
  // NestPing API checks
  { id: 'chk-1-1', monitorId: 'mon-1', checkedAt: new Date(Date.now() - 42 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 198 },
  { id: 'chk-1-2', monitorId: 'mon-1', checkedAt: new Date(Date.now() - 102 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 204 },
  { id: 'chk-1-3', monitorId: 'mon-1', checkedAt: new Date(Date.now() - 162 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 189 },
  { id: 'chk-1-4', monitorId: 'mon-1', checkedAt: new Date(Date.now() - 222 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 211 },
  { id: 'chk-1-5', monitorId: 'mon-1', checkedAt: new Date(Date.now() - 282 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 196 },
  // Main Website checks
  { id: 'chk-2-1', monitorId: 'mon-2', checkedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 312 },
  { id: 'chk-2-2', monitorId: 'mon-2', checkedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 298 },
  { id: 'chk-2-3', monitorId: 'mon-2', checkedAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 334 },
  { id: 'chk-2-4', monitorId: 'mon-2', checkedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 288 },
  { id: 'chk-2-5', monitorId: 'mon-2', checkedAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 319 },
  // Documentation checks
  { id: 'chk-3-1', monitorId: 'mon-3', checkedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 1240 },
  { id: 'chk-3-2', monitorId: 'mon-3', checkedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 1180 },
  { id: 'chk-3-3', monitorId: 'mon-3', checkedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 892 },
  { id: 'chk-3-4', monitorId: 'mon-3', checkedAt: new Date(Date.now() - 17 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 1350 },
  { id: 'chk-3-5', monitorId: 'mon-3', checkedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 1120 },
  // Payment Service checks
  { id: 'chk-4-1', monitorId: 'mon-4', checkedAt: new Date(Date.now() - 55 * 1000).toISOString(), success: false, errorType: 'error', errorMessage: 'Connection refused' },
  { id: 'chk-4-2', monitorId: 'mon-4', checkedAt: new Date(Date.now() - 115 * 1000).toISOString(), success: false, errorType: 'error', errorMessage: 'Connection refused' },
  { id: 'chk-4-3', monitorId: 'mon-4', checkedAt: new Date(Date.now() - 175 * 1000).toISOString(), success: false, errorType: 'timeout', errorMessage: 'Request timed out after 10s' },
  { id: 'chk-4-4', monitorId: 'mon-4', checkedAt: new Date(Date.now() - 235 * 1000).toISOString(), success: false, errorType: 'error', errorMessage: 'Connection refused' },
  { id: 'chk-4-5', monitorId: 'mon-4', checkedAt: new Date(Date.now() - 295 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 234 },
  // Customer Portal checks (paused)
  { id: 'chk-5-1', monitorId: 'mon-5', checkedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 445 },
  { id: 'chk-5-2', monitorId: 'mon-5', checkedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 412 },
  { id: 'chk-5-3', monitorId: 'mon-5', checkedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), success: true, statusCode: 200, responseTime: 468 },
];

// ─── Response Time Data (24h) ────────────────────────────────────────────────

function generate24hData(baseLatency: number, spiky = false): ResponseDataPoint[] {
  const points: ResponseDataPoint[] = [];
  const now = Date.now();
  for (let i = 48; i >= 0; i--) {
    const time = new Date(now - i * 30 * 60 * 1000);
    const hour = time.getHours();
    const label = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    // Add realistic variation
    let value = baseLatency + (Math.random() - 0.5) * baseLatency * 0.3;
    // Peak hours variation
    if (hour >= 9 && hour <= 18) value *= 1.1;
    // Random spike
    if (spiky && Math.random() < 0.08) value *= 3.5;
    points.push({ time: label, responseTime: Math.round(Math.max(50, value)) });
  }
  return points;
}

function generate7dData(baseLatency: number, spiky = false): ResponseDataPoint[] {
  const points: ResponseDataPoint[] = [];
  const now = Date.now();
  for (let i = 168; i >= 0; i -= 3) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const label = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    let value = baseLatency + (Math.random() - 0.5) * baseLatency * 0.4;
    if (spiky && Math.random() < 0.05) value *= 4;
    // Payment service was down — show 0 during incident window
    points.push({ time: label, responseTime: Math.round(Math.max(0, value)) });
  }
  return points;
}

export const responseTimeData: Record<string, { '24h': ResponseDataPoint[]; '7d': ResponseDataPoint[]; '30d': ResponseDataPoint[] }> = {
  'mon-1': { '24h': generate24hData(198), '7d': generate7dData(198, true), '30d': generate7dData(198) },
  'mon-2': { '24h': generate24hData(312), '7d': generate7dData(312), '30d': generate7dData(312) },
  'mon-3': { '24h': generate24hData(1240, true), '7d': generate7dData(900, true), '30d': generate7dData(700) },
  'mon-4': { '24h': generate24hData(234, true), '7d': generate7dData(234, true), '30d': generate7dData(234) },
  'mon-5': { '24h': generate24hData(445), '7d': generate7dData(445), '30d': generate7dData(445) },
  'overview': { '24h': generate24hData(248, true), '7d': generate7dData(248, true), '30d': generate7dData(248) },
};

// ─── Uptime History (status bars) ───────────────────────────────────────────

export const uptimeHistory: Record<string, UptimePeriod[]> = {
  'mon-1': [
    { start: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), status: 'up' },
    { start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'down' },
    { start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString(), status: 'up' },
  ],
  'mon-2': [
    { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(), status: 'up' },
    { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'degraded' },
    { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString(), status: 'up' },
  ],
  'mon-3': [
    { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 18 * 60 * 1000).toISOString(), status: 'up' },
    { start: new Date(Date.now() - 18 * 60 * 1000).toISOString(), end: new Date().toISOString(), status: 'degraded' },
  ],
  'mon-4': [
    { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() - 47 * 60 * 1000).toISOString(), status: 'up' },
    { start: new Date(Date.now() - 47 * 60 * 1000).toISOString(), end: new Date().toISOString(), status: 'down' },
  ],
  'mon-5': [
    { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString(), status: 'up' },
  ],
};

// ─── Summary Stats ────────────────────────────────────────────────────────────

export const overviewStats = {
  totalMonitors: 5,
  operational: 2,
  degraded: 1,
  down: 1,
  paused: 1,
  avgUptime: 99.59,
  avgResponseTime: 248,
  activeIncidents: 2,
  period30dUptime: 99.94,
};

// ─── Analytics Data ───────────────────────────────────────────────────────────

export const analyticsUptimeTrend = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  uptime: 99.5 + Math.random() * 0.5,
}));

export const analyticsResponseTrend = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  avg: Math.round(220 + Math.random() * 80),
  p95: Math.round(380 + Math.random() * 200),
}));

export const analyticsMonitorComparison = monitors.filter(m => m.status !== 'paused').map(m => ({
  name: m.name,
  uptime: m.uptime,
  responseTime: m.responseTime || 0,
}));

export const analyticsDowntimeDistribution = monitors.filter(m => m.status !== 'paused').map(m => {
  const totalMins = 30 * 24 * 60;
  const downtimeMins = Math.round(totalMins * (1 - m.uptime / 100));
  return { name: m.name, downtime: downtimeMins };
});
