# NestPing — SaaS Uptime & Performance Monitoring Platform

NestPing is a high-density, developer-first website uptime, performance, and incident monitoring dashboard console. It provides real-time health inspection, response time tracking, latency analytics, incident root cause timelines, and public status page capabilities.

---

## Workspace Structure

The project is organized into clean, dedicated directories:

```text
NestPing/
├── frontend/
│   └── nestping-app/          # Core React + Vite + TypeScript application
│       ├── src/
│       │   ├── components/    # Reusable UI primitives, layout, and monitor widgets
│       │   ├── context/       # Local state management (MonitoringContext)
│       │   ├── data/          # Synthetic monitoring telemetry and incident records
│       │   ├── lib/           # Formatters and utility functions
│       │   ├── pages/         # 7 functional views (Overview, Monitors, Incidents, etc.)
│       │   └── types/         # TypeScript interfaces (Monitor, Incident, CheckResult)
│       ├── public/            # Static assets
│       ├── package.json
│       ├── vite.config.ts     # Vite + Tailwind CSS v4 configuration
│       └── tsconfig.json      # TypeScript compiler configuration
│
├── docs/
│   ├── PRODUCT.md             # Durable product truth, user personas, workflows, principles
│   └── DESIGN.md              # Design system tokens, typography, elevation, and component rules
│
├── .agent/
│   └── skills/                # Agent workflows and skills (Impeccable design skill)
│
├── .impeccable/               # Machine-readable design system sidecar and configuration
│   └── design.json            # Design token schema and shadow DOM component snippets
│
├── .gitignore                 # Root Git exclusion rules
└── README.md                  # Project overview and developer workflow
```

---

## Documentation

- **Product Context:** [`docs/PRODUCT.md`](docs/PRODUCT.md)
  Covers product purpose, user personas, operating context (Operate mode), core workflows, and product principles.
- **Design System:** [`docs/DESIGN.md`](docs/DESIGN.md)
  Covers normative design tokens, color palette (`#0B1120`, `#151F32`, `#253247`, `#22D3EE`, `#35D07F`, `#F05265`, `#F5B942`, `#E5EDF7`, `#8493A8`), typography, tabular rules, layout density, and component specifications.

---

## Getting Started (Frontend Development)

All frontend commands must be executed from inside `frontend/nestping-app`.

### 1. Navigate to the Frontend Directory

```powershell
cd E:\NestPing\frontend\nestping-app
```

### 2. Start the Development Server

```powershell
npm run dev
```

The application will start with HMR (Hot Module Replacement) accessible at:
```text
http://127.0.0.1:5173/
```

### 3. Production Build

To run the TypeScript type check and compile the production bundle:

```powershell
npm run build
```

Production output will be generated in `frontend/nestping-app/dist/`.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8 + `@vitejs/plugin-react`
- **Styling:** Tailwind CSS v4 + `@tailwindcss/vite`
- **UI Primitives:** Radix UI (`@radix-ui/react-*`) + Lucide React icons
- **Charts & Telemetry:** Recharts
- **Routing:** React Router v7 (`react-router-dom`)
- **Query Foundation:** TanStack Query v5 (`@tanstack/react-query`)
- **Utilities:** date-fns, clsx, tailwind-merge
