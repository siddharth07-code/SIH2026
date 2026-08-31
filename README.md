# JANPRAMAAN — Identity Intelligence

> **AI-Based Fake Identity & Document Screening Platform**  
> **Problem Statement / Challenge ID:** SIH26188  
> **Repository:** SIH2026 (Web Command Center)  
> **Target Audience:** Border Control Supervisors, Identity Verification Adjudicators, Forensic Analysts, and System Administrators.

---

[![Next.js](https://img.shields.io/badge/Next.js-15.5.24-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Zod](https://img.shields.io/badge/Zod-v3-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.7-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-108%20Passed-brightgreen?style=for-the-badge)](#testing--qa-verification)

---

## 1. Executive Summary

**JANPRAMAAN** (*Identity Intelligence*) is an enterprise-grade identity and document risk-screening command platform engineered to assist authorized officers in detecting forged, manipulated, and fraudulent identity documents at border checkpoints, immigration desks, and law-enforcement terminals.

Rather than acting as an unexplainable "black-box fake classifier", JANPRAMAAN synthesizes multiple independent deterministic and machine-learning signals into a transparent, evidence-based risk assessment.

### Core Architectural Principle

$$\text{Models Detect} \;\longrightarrow\; \text{Deterministic Validators Validate} \;\longrightarrow\; \text{Risk Engine Evaluates} \;\longrightarrow\; \text{LLM Explains} \;\longrightarrow\; \mathbf{Human\;Officer\;Adjudicates}$$

> **Key Rule:** Artificial intelligence assists and explains; authorized human officers retain authoritative operational adjudication.

---

## 2. Tri-Repository System Architecture

The complete JANPRAMAAN platform operates across three specialized, decoupled repositories:

```
                                      JANPRAMAAN PLATFORM
                                 (Identity Intelligence — SIH26188)
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
        SIH2026-mobile                                                SIH2026 (THIS REPOSITORY)
    Flutter Officer Mobile App                                        Next.js Web Command Center
  (Checkpoint capture & ingestion)                               (Supervisory triage, forensic investigation,
                 │                                                governance review & audit journal)
                 │                                                             │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                       HTTPS / REST API v1
                                                │
                                                ▼
                                         SIH2026-backend
                                    Central FastAPI Gateway
                                                │
                     ┌──────────────────────────┼──────────────────────────┐
                     ▼                          ▼                          ▼
               Document OCR              MRZ Parser & Checksum      Digital Forensics
             (Tesseract / TrOCR)            (ICAO Doc 9303)         (Splicing, ELA, Copy-Move)
                     │                          │                          │
                     └──────────────────────────┼──────────────────────────┘
                                                ▼
                                       Biometric Verification
                                     (Face Embedding Parity &
                                      Presentation Liveness)
                                                │
                                                ▼
                                    Deterministic Risk Engine
                                    (Explainable Multi-Signal)
                                                │
                                                ▼
                                      LLM Explanation Layer
                                                │
                                                ▼
                                   Structured Verification Schema
```

| Repository | Technology Stack | Primary Purpose |
| :--- | :--- | :--- |
| **`SIH2026`** *(Current)* | Next.js 15, TypeScript, Tailwind CSS, TanStack Query, Zod | **Web Command Center:** Operational dashboard, case investigation, forensic heatmaps, audit trail, administrative policies. |
| **`SIH2026-mobile`** | Flutter, Dart | **Officer Mobile Ingestion:** High-speed document capture, live portrait capture, offline-tolerant queuing. |
| **`SIH2026-backend`** | FastAPI, Python, PostgreSQL, SQLAlchemy, PyTorch, OpenCV | **Central Intelligence Engine:** OCR extraction, MRZ checksum parsing, digital image forensics, biometric matching, append-only audit logging. |

---

## 3. Web Command Center Capabilities

### 🛡️ 1. Operational Command Center (`/dashboard`)
- Real-time screening throughput, active cases requiring supervisory attention, and risk severity distributions.
- **Truth-in-UI Philosophy:** Honest neutral states (`—`) during backend service disconnection rather than deceptive fabricated statistics.
- Quick navigation to high-priority triage queues and operational events.

### 📋 2. Verification Case Queue (`/verifications`)
- High-density operational data table with server-side pagination, multi-attribute facet filtering (Risk Level, Status, Document Type, Date Range), and full-text search.
- URL-synchronized query parameters enabling instant link sharing and state restoration.
- Distinct visual empty states: *Backend Offline*, *Empty Roster*, *Filter Mismatch*, and *Network Error*.

### 🔍 3. Verification Investigation Workspace (`/verifications/[id]`)
- Deep case context containing extracted identity details, document metadata, issuing country, and checkpoint tracking IDs.
- Deterministic Risk Score card with clear severity badges (`LOW`, `MEDIUM`, `HIGH`) and recommended actions (`CLEAR`, `REVIEW`, `MANUAL_VERIFICATION`, `ESCALATE`).
- Comprehensive findings inventory detailing OCR vs. MRZ discrepancies, structural anomalies, and cryptographic check digit validation.
- Direct case action dispatchers (Review, Clear, Escalate) with strict role-based clearance checks.

### 🔬 4. Evidence Center & Forensic Inspection (`/evidence/[id]`)
- **Document Inspector:** Interactive zoom, pan, rotation, and high-resolution bounding-box overlay layer.
- **Forensic Anomaly Modes:** Multi-spectrum visualization including *Original RGB*, *Error Level Analysis (ELA)*, *Splicing Heatmap Localization*, and *Compression Inconsistency Analysis*.
- **OCR $\leftrightarrow$ MRZ Parity Matrix:** Side-by-side field comparison (Document Number, Date of Birth, Expiry, Holder Name, Country Code) with automated checksum match flags.
- **Biometric Matching & Liveness:** Holder document portrait vs. live checkpoint capture facial embedding similarity score and presentation attack liveness confidence.
- **Provenance Telemetry:** Traceable worker service IDs, model versions, bounding-box coordinate arrays, and inference execution timestamps.

### 📜 5. Immutable Audit Trail & Governance (`/audit`)
- Append-only event journal logging every authentication attempt, document ingestion, risk evaluation, supervisor review, and case escalation.
- Synchronized live UTC time standard and operational clearance badges.
- **State Transition Diff View:** Detailed *Before State* $\to$ *After State* JSON delta tracking.
- **Cryptographic Chaining Visualization:** SHA-256 event hash, previous block hash chaining, and sequence verification status (`VERIFIED`, `PENDING`, `INVALID`).

### 👥 6. Officer & Terminal Roster (`/officers`)
- Directory of authorized checkpoint personnel, mobile terminal units, and active post assignments.
- Central IAM directory sync indicators and role-aware clearance enforcement.

### ⚙️ 7. System Settings & Security Policies (`/settings`)
- Gateway endpoint boundaries (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_ENV`).
- Deterministic Risk Engine Calibration policies (ICAO 9303 Checksum strictness, OCR/MRZ floor, biometric parity cutoffs).
- AI Pipeline Boundary Isolation rules preventing browser-level model execution or secret exposure.

### 🚫 8. High-Trust Error Handling (`404` / Error Boundaries)
- Custom glassmorphic `not-found.tsx` with diagnostic security metadata and direct route recovery paths.

---

## 4. Technology Stack & Design System

```
Frontend Architecture Stack
├── Core Framework:        Next.js 15.5.24 (App Router)
├── UI Library:            React 19.0.0
├── Language:              TypeScript 5.7.3 (Strict Mode)
├── Styling:               Tailwind CSS 3.4.17
├── Design System:         Custom Glassmorphic Security Operations Theme
│                          ├── Background: #020617 (Slate 950)
│                          ├── Surfaces: rgba(15, 23, 42, 0.65) + 24px backdrop blur
│                          ├── Accents: #3b82f6 (Primary), #10b981 (Success), #f43f5e (Critical)
│                          └── High-contrast accessible borders & subtle specular highlights
├── Server State:          TanStack Query v5 (React Query)
├── Schema Validation:     Zod 3.24.2 (Strict Boundary Type Inference)
├── Icons:                 Lucide React 0.475.0
└── Test Runner:           Vitest 3.2.7 + React Testing Library 16.2.0
```

---

## 5. Security, Privacy & Boundary Guarantees

1. **Zero Client-Side Secrets:** No Hugging Face tokens, LLM API keys, database credentials, or private certificates exist in the web client.
2. **Centralized API Boundary:** All network communication is routed through a single typed API client (`src/lib/api/client.ts`). Direct or ad-hoc `fetch()` calls from components are strictly prohibited.
3. **Runtime Schema Parsing:** All external API responses are validated against strict Zod schemas before entering the React state layer.
4. **Data Minimization:** Sensitive identity attributes (e.g., passport numbers) are automatically masked (`maskDocumentNumber`) across UI components.
5. **No Client-Side Authorization Assumptions:** UI-level role guards (`RouteGuard`) are treated as UX helpers only; authoritative authorization is enforced strictly by backend token validation.
6. **Zero Fabricated Data:** The production build contains no mock records, fake risk scores, or synthetic metrics. Test fixtures are strictly isolated in `tests/fixtures/`.

---

## 6. Directory Structure

```
SIH2026/
├── src/
│   ├── app/                                # Next.js 15 App Router Routes
│   │   ├── (auth)/
│   │   │   └── login/                      # /login - Authentication Portal
│   │   ├── (dashboard)/
│   │   │   ├── audit/                      # /audit - Immutable Audit & Governance Center
│   │   │   ├── dashboard/                  # /dashboard - Screening Command Center
│   │   │   ├── evidence/[id]/              # /evidence/[id] - Forensic Evidence Center
│   │   │   ├── officers/                   # /officers - Authorized Personnel & Terminal Directory
│   │   │   ├── settings/                   # /settings - System Policies & Gateway Config
│   │   │   ├── verifications/              # /verifications - Screening Queue
│   │   │   └── verifications/[id]/          # /verifications/[id] - Case Detail & Adjudication
│   │   ├── globals.css                     # Design tokens & glassmorphic utilities
│   │   ├── layout.tsx                      # Root Layout & Global Context Providers
│   │   ├── not-found.tsx                   # Custom Glassmorphic 404 Route
│   │   └── page.tsx                        # Root index redirecting to /dashboard
│   ├── components/
│   │   ├── layout/                         # AppShell, Header, Sidebar, RouteGuard, UserMenu
│   │   ├── shared/                         # EmptyState, LoadingState, PageHeader, StatusIndicator
│   │   └── ui/                             # Button, Input, Card, Badge, Modal, Tooltip
│   ├── config/                             # Environment validation (env.ts) & Navigation config
│   ├── features/                           # Domain-driven feature modules
│   │   ├── audit/                          # Audit table, detail dossier, integrity status, timeline
│   │   ├── auth/                           # Auth context, useAuth hook, LoginForm
│   │   ├── dashboard/                      # KPI summary, workload queue, risk overview, activity
│   │   ├── evidence/                       # Forensic image viewer, ELA modes, OCR/MRZ matrix
│   │   └── verifications/                  # Screening table, filters, pagination, adjudication
│   ├── lib/
│   │   ├── api/                            # Centralized ApiClient, ApiError, Feature API clients
│   │   ├── utils/                          # Formatting, styling helpers (cn.ts, formatters.ts)
│   │   └── validation/                     # Zod runtime API schemas
│   ├── providers/                          # QueryProvider (TanStack Query v5)
│   └── types/                              # Strict TypeScript domain interfaces
├── tests/                                  # Vitest unit & integration test suites
│   ├── fixtures/                           # Isolated test mock fixtures (Never imported by src/)
│   ├── audit-api.test.ts
│   ├── audit-center.test.tsx
│   ├── auth-api.test.ts
│   ├── auth-context.test.tsx
│   ├── components.test.tsx
│   ├── dashboard-api.test.ts
│   ├── dashboard-components.test.tsx
│   ├── dashboard-role.test.tsx
│   ├── evidence-api.test.ts
│   ├── evidence-center.test.tsx
│   ├── login-form.test.tsx
│   ├── navigation-role.test.ts
│   ├── not-found.test.tsx
│   ├── officers-page.test.tsx
│   ├── route-guard.test.tsx
│   ├── settings-page.test.tsx
│   ├── utils.test.ts
│   ├── validation.test.ts
│   ├── verification-detail.test.tsx
│   ├── verifications-api.test.ts
│   └── verifications-queue.test.tsx
├── .env.example                            # Example environment variables
├── GEMINI.md                               # Persistent architectural specification & constraints
├── package.json                            # Project dependencies and operational scripts
├── tailwind.config.ts                      # Tailwind styling configuration
├── tsconfig.json                           # Strict TypeScript configuration
└── vitest.config.ts                        # Vitest configuration & JSDOM test setup
```

---

## 7. Getting Started

### Prerequisites
- **Node.js:** `v20.x` or higher (tested on `v24.x`)
- **npm:** `v10.x` or `v11.x`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/siddharth07-code/SIH2026.git
   cd SIH2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` to point to your backend API gateway:*
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_APP_ENV=development
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 8. Operational NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server (with Turbopack/Hot-Reloading). |
| `npm run build` | Compiles and optimizes the application for production deployment. |
| `npm run start` | Boots the production Next.js server. |
| `npm run typecheck` | Executes strict TypeScript static analysis without emitting output (`tsc --noEmit`). |
| `npm run lint` | Runs Next.js / ESLint code quality checks. |
| `npm test` | Runs all 108 Vitest unit and integration test suites. |
| `npm run test:watch` | Starts Vitest in interactive file-watching mode. |

---

## 9. Testing & QA Verification

The repository enforces **100% automated test coverage** across all critical domain interfaces, API clients, authentication guards, and UI components:

```bash
# Execute the full automated test suite
npm test
```

### Test Suite Summary

```
 ✓ tests/auth-context.test.tsx (4 tests)
 ✓ tests/dashboard-role.test.tsx (4 tests)
 ✓ tests/components.test.tsx (5 tests)
 ✓ tests/login-form.test.tsx (5 tests)
 ✓ tests/dashboard-components.test.tsx (9 tests)
 ✓ tests/verifications-queue.test.tsx (7 tests)
 ✓ tests/verification-detail.test.tsx (3 tests)
 ✓ tests/evidence-center.test.tsx (4 tests)
 ✓ tests/route-guard.test.tsx (4 tests)
 ✓ tests/audit-center.test.tsx (9 tests)
 ✓ tests/verifications-api.test.ts (5 tests)
 ✓ tests/api-client.test.ts (8 tests)
 ✓ tests/utils.test.ts (8 tests)
 ✓ tests/settings-page.test.tsx (2 tests)
 ✓ tests/auth-api.test.ts (7 tests)
 ✓ tests/officers-page.test.tsx (1 test)
 ✓ tests/not-found.test.tsx (1 test)
 ✓ tests/audit-api.test.ts (5 tests)
 ✓ tests/evidence-api.test.ts (2 tests)
 ✓ tests/dashboard-api.test.ts (5 tests)
 ✓ tests/validation.test.ts (6 tests)
 ✓ tests/navigation-role.test.ts (4 tests)

 Test Files  22 passed (22)
      Tests  108 passed (108)
```

---

## 10. Role-Based Access Control (RBAC) Matrix

| Workspace / Route | Officer | Supervisor | Administrator |
| :--- | :---: | :---: | :---: |
| **Command Center Dashboard** (`/dashboard`) | Read-Only | Read / Action | Read / Action |
| **Screening Queue** (`/verifications`) | Ingest & View | Triage & Filter | Triage & Filter |
| **Case Detail** (`/verifications/[id]`) | View Case | Adjudicate / Clear / Escalate | Full Adjudication |
| **Evidence Center** (`/evidence/[id]`) | Inspect Document | Deep Forensics Review | Deep Forensics Review |
| **Audit Trail & Governance** (`/audit`) | ❌ Restricted | Read Audit Logs | Full Audit & Provenance |
| **Officers & Checkpoint Directory** (`/officers`) | ❌ Restricted | View Terminal Status | Full Roster Management |
| **System Settings & Policies** (`/settings`) | ❌ Restricted | ❌ Restricted | Full Policy & Gateway Config |

---

## 11. Project Standards & Constraints

- **Language & Platform:** TypeScript Strict Mode + Next.js 15 App Router.
- **Styling Paradigm:** Tailwind CSS utility tokens with bespoke glassmorphic security command palette.
- **Specification Source of Truth:** Refer to [GEMINI.md](file:///Users/siddharthlal/Desktop/SIH2026/GEMINI.md) for authoritative system boundaries, domain models, and pipeline specifications.

---

<div align="center">
  <sub>Built for <strong>Smart India Hackathon 2026 (Problem Statement SIH26188)</strong> — AI-Based Fake Identity & Document Screening.</sub><br/>
  <sub><strong>JANPRAMAAN</strong> — Identity Intelligence. All rights reserved.</sub>
</div>
