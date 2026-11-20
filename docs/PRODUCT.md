# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Recharts + React Router + TanStack Query

## Users

**Primary:** Developers, DevOps engineers, and system administrators who actively monitor production infrastructure. They operate in alert-driven contexts, often context-switching between this tool and terminals, CI dashboards, and incident channels. Time-to-understanding matters more than discoverability.

**Secondary:** Website owners and small technical teams who need reliable uptime visibility without operational overhead.

## Product Purpose

NestPing monitors websites, APIs, and services for uptime and performance. It detects downtime, measures response time, tracks incidents, and provides reliability metrics. Success means users know the health of their infrastructure at a glance and can diagnose incidents without leaving the tool.

## Positioning

A developer-first uptime monitoring tool with an infrastructure console aesthetic — precise, information-dense, and designed to be operated rather than admired. Not a marketing dashboard or a generic SaaS admin panel.

## Operating Context

- Users open NestPing when something may be wrong, or on a regular check-in routine
- Primary workflow: scan overview → identify anomalies → drill into monitor detail → review incidents
- Secondary workflows: add new monitor, review analytics trends, configure notification rules
- Context: browser tab alongside terminal, Slack, PagerDuty, or CI dashboards
- Mode: **Operate** — users are completing tasks, not exploring features

## Capabilities and Constraints

- Frontend-only prototype with realistic mock data
- No real monitoring backend
- Local state management (React state + localStorage where useful)
- Mock data must be internally consistent across all pages
- Monitors: HTTP uptime checks with configurable intervals
- Status vocabulary: operational, degraded, down, paused
- Incidents: detected → threshold reached → created → recovery → resolved
- Free plan: 5 monitors maximum
- Check intervals: 1 min, 5 min, 10 min, 30 min, 1 hr

## Brand Commitments

- Name: NestPing
- Personality: Technical, Precise, Calm, Trustworthy, Minimal, Data-driven, Modern
- Palette: Deep navy background (#0B1120), card surfaces (#151F32), borders (#253247), cyan primary (#22D3EE), green success (#35D07F), red danger (#F05265), yellow warning (#F5B942), text (#E5EDF7), muted (#8493A8)
- Typography: Inter or Geist — a workhorse UI sans with tabular figures for metrics
- Mode: Operate — restrained design, precision over expression

## Evidence on Hand

All data is synthetic/mock. No real monitoring backend exists. Product is a frontend prototype for demonstration.

## Product Principles

1. **Clarity over decoration** — every element earns its presence by conveying information or enabling action
2. **Status is always visible** — health state must be unambiguous at a glance, never buried
3. **Data drives layout** — information density serves the user's scanning pattern, not visual rhythm
4. **Consistent vocabulary** — the same status, the same color, the same label, everywhere
5. **Efficiency first** — reduce clicks, reduce reading, reduce decision fatigue

## Accessibility & Inclusion

- WCAG 2.1 AA contrast minimum
- Keyboard navigable interface
- Semantic HTML structure
- Accessible dialogs with focus management
- Descriptive icon labels / tooltips for icon-only controls
