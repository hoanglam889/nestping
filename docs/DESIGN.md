---
name: NestPing
description: High-density infrastructure uptime monitoring console
colors:
  background: "#0B1120"
  card: "#151F32"
  border: "#253247"
  primary: "#22D3EE"
  success: "#35D07F"
  danger: "#F05265"
  warning: "#F5B942"
  text: "#E5EDF7"
  muted: "#8493A8"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
---

# Design System: NestPing

## Overview

**Creative North Star: "The Precision Telemetry Console"**

NestPing is an infrastructure-grade uptime and telemetry dashboard designed for operators who monitor mission-critical services. The aesthetic rejects marketing fluff, oversized cards, and decorative gradients in favor of information density, fast scanning, and unambiguous status signaling. Every layout choice serves rapid diagnostics and operational calm.

The visual language draws inspiration from precision observability tooling (Better Stack, Grafana, Linear, Sentry) while maintaining its own distinct identity. High contrast, sharp dark surfaces, and disciplined semantic color usage ensure that anomalies stand out immediately while healthy infrastructure remains quietly reassuring.

**Key Characteristics:**
- **Operate Mode Priority:** Engineered for fast scanning and active diagnosis over visual spectacle.
- **Strict Semantic Color:** Accent colors indicate state and action, never ambient decoration.
- **Tabular Precision:** All metric counters, durations, timestamps, and latency figures use tabular figures (`font-variant-numeric: tabular-nums`).
- **Layered Surfaces:** Clear depth hierarchy from canvas (`#0B1120`) to cards (`#151F32`) to subtle structural borders (`#253247`).

## Colors

The palette is restrained, dark, and strictly semantic. Primary cyan (`#22D3EE`) serves as the active signal, while success, warning, and danger states indicate operational status.

### Primary
- **Telemetry Cyan** (`#22D3EE`): Used exclusively for primary interactive triggers, active navigation items, links, and response time chart lines. Represents active observation.

### Secondary
- **Operational Green** (`#35D07F`): Semantic status for healthy services, resolved incidents, and high uptime metrics (>99.9%).
- **Degraded Amber** (`#F5B942`): Semantic status for latency degradation, quota warnings, and threshold cautions.
- **Incident Coral** (`#F05265`): Semantic status for down services, active outages, failed HTTP checks, and destructive actions.

### Neutral
- **Deep Navy Background** (`#0B1120`): Application base canvas.
- **Console Card** (`#151F32`): Elevated panels, data tables, dialog surfaces, and dropdown menus.
- **Structural Border** (`#253247`): 1px borders providing crisp demarcation between components without visual weight.
- **High-Readability Text** (`#E5EDF7`): Primary typography and metric values.
- **Telemetry Muted** (`#8493A8`): Secondary labels, table headers, breadcrumbs, and subtle metadata.

### Named Rules
**The Rarity of Red Rule.** Coral danger (`#F05265`) is reserved exclusively for actual downtime, active incidents, and destructive confirmation. When an operator sees red, it demands action.
**The No-Color Ground Rule.** Background and card surfaces never tint toward warm or purple hues; they remain calibrated cool charcoal-navy.

## Typography

**Display & Body Font:** Inter (with system-ui, -apple-system, sans-serif fallbacks).
**Character:** Workhorse technical sans-serif with tabular numeric figures and subtle negative tracking on headings for compact density.

### Hierarchy
- **Display** (Semi-bold, 24px-28px, line-height 1.2): Page titles and primary metric counters.
- **Headline** (Semi-bold, 16px-18px, line-height 1.3): Section headers, modal titles, and card group titles.
- **Title** (Medium, 14px, line-height 1.4): Table row titles, monitor names, and incident subject lines.
- **Body** (Regular, 12px-13px, line-height 1.5): Descriptive copy, check log entries, and dialog descriptions.
- **Label** (Medium/Uppercase, 10px-11px, letter-spacing 0.05em): Table column headers, stat card labels, and status badges.

### Named Rules
**The Tabular Metric Rule.** Every numerical value representing latency (ms), uptime (%), time duration, or clock time must render with tabular figures to prevent jitter during updates.

## Layout

The application employs a fixed-width collapsible left navigation bar (208px expanded, 56px collapsed) and a sticky utility header (48px height) framing a responsive content container with a maximum width of 1400px.

- **Grid System:** 12-column responsive layout adapting from 1 column on mobile (≤640px) to 2-4 columns on tablet (641px-1024px) and 4-5 column asymmetrical splits on wide desktop (≥1280px).
- **Density:** High density with consistent 12px to 20px padding on card containers. Table rows maintain a compact 36px-40px height for optimal vertical scanning.

## Elevation & Depth

NestPing conveys depth through tonal contrast and crisp borders rather than diffuse drop shadows.

- **Surfaces at Rest:** Completely flat with a 1px solid border (`#253247`) against the darker background (`#0B1120`).
- **Elevated Overlays:** Modals, tooltips, and dropdown menus receive subtle elevation (`0 10px 25px -5px rgba(0, 0, 0, 0.5)`) paired with a backdrop blur on overlays.

### Named Rules
**The Border-First Elevation Rule.** Elevation is defined by surface color hierarchy and 1px borders. Glow effects and colored halos are prohibited.

## Shapes

- **Border Radii:** Disciplined and compact:
  - Micro elements (badges, buttons, inputs): 4px to 6px (`rounded-md`).
  - Container cards and tables: 8px (`rounded-lg`).
  - Modal dialogs: 8px to 12px (`rounded-xl`).
- **Form Controls:** Compact form elements (28px to 32px height) with 1px borders and high-contrast focus rings (`#22D3EE`).

## Components

### Buttons
- **Shape:** 6px radius (`rounded-md`).
- **Primary:** Background `#22D3EE`, text `#0B1120`, font-weight 500. Hover brightness reduction (90%).
- **Secondary:** Background `#151F32`, border `#253247`, text `#E5EDF7`.
- **Danger:** Background `rgba(240, 82, 101, 0.1)`, border `rgba(240, 82, 101, 0.2)`, text `#F05265`.

### Status Badges
- **Shape:** 4px radius, inline-flex with a 6px status dot.
- **Variants:**
  - Operational: Green dot `#35D07F`, background `rgba(53, 208, 127, 0.1)`, border `rgba(53, 208, 127, 0.2)`.
  - Degraded: Amber dot `#F5B942`, background `rgba(245, 185, 66, 0.1)`, border `rgba(245, 185, 66, 0.2)`.
  - Down: Coral dot `#F05265`, background `rgba(240, 82, 101, 0.1)`, border `rgba(240, 82, 101, 0.2)`.
  - Paused: Muted dot `#8493A8`, background `rgba(132, 147, 168, 0.1)`, border `rgba(132, 147, 168, 0.2)`.

### Stat Cards
- **Structure:** Elevated card with uppercase micro-label, primary tabular metric, supporting context line, and right-aligned icon.

### Response Time Charts
- **Style:** Clean Recharts single-line or area charts with cyan line (`#22D3EE`), dark gridlines (`#253247`), and dark tooltip cards. No heavy gradient washes.

### Uptime History Bars
- **Style:** 90 continuous vertical micro-bars (2px-3px width) colored by day status (green, amber, coral) representing 90-day reliability.

## Do's and Don'ts

### Do:
- **Do** format all latency metrics with units (ms, s) and render them with tabular figures.
- **Do** keep table headers compact, uppercase, and colored with `#8493A8`.
- **Do** provide instant toast feedback on every state mutation (add, edit, pause, delete, resolve).
- **Do** ensure interactive elements have clear `:focus-visible` outlines in primary cyan (`#22D3EE`).
- **Do** collapse the sidebar smoothly on small viewports and provide a comfortable mobile drawer.

### Don't:
- **Don't** use decorative gradients across page backgrounds or card surfaces.
- **Don't** use emojis as operational status indicators.
- **Don't** use glowing halos or continuous animated pulses on status indicators during normal operation.
- **Don't** make every metric card the same generic size or hide status information behind nested clicks.
- **Don't** add decorative illustrations or marketing banners inside an operator's workspace.
