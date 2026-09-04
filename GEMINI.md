# GEMINI.md

# JANPRAMAAN — Identity Intelligence

> **Product Name:** JANPRAMAAN  
> **Descriptor:** Identity Intelligence  
> **Challenge / Problem ID:** SIH26188 (AI-Based Fake Identity & Document Screening)  
> **Current Repository:** SIH2026  
> **Current Application:** Web Command Center  
> **Development Approach:** Production-oriented working system, not a static demo

---

# 1. PURPOSE OF THIS FILE

This file is the persistent engineering context and source of truth for
AI coding agents working on SIH26188.

Every agent MUST read this file completely before:

- creating files
- modifying files
- installing dependencies
- changing architecture
- implementing features
- making database decisions
- introducing AI/ML services

If an instruction in a future task conflicts with this document, identify
the conflict before making architectural changes.

Do not silently ignore these rules.

---

# 2. PRODUCT VISION

SIH26188 is an identity and document risk-screening platform designed to
assist authorized officers in detecting:

1. suspicious or manipulated identity documents
2. inconsistencies within identity documents
3. possible identity impersonation
4. other document and identity risk signals

The system is NOT simply:

> "AI that says whether a document is fake."

Instead, it combines multiple independent verification signals into an
explainable evidence-based risk assessment.

The fundamental product principle is:

> **Models detect.**
>
> **Deterministic validators validate.**
>
> **The risk engine evaluates.**
>
> **The LLM explains.**
>
> **A human officer makes the operational decision.**

The system must assist human decision-making rather than pretending to
replace authorized officers or make legal determinations.

---

# 3. PRODUCT SCOPE

The initial MVP focuses on passport screening.

The architecture must remain extensible to additional identity documents,
but future document types must not be implemented prematurely.

Potential future documents include:

- visas
- driving licences
- voter identification
- permits
- other government-issued identity documents

The MVP should prioritize depth and reliability for passports rather than
shallow support for many document types.

---

# 4. SYSTEM COMPONENTS

The complete SIH26188 platform consists of three independent repositories.

## Repository 1 — SIH2026

### Web Command Center

Technology:

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui or equivalent reusable UI system
- TanStack Query
- Zod

Primary users:

- supervisors
- administrators
- authorized review personnel

Responsibilities:

- authentication interface
- operational dashboard
- verification history
- verification investigation
- evidence visualization
- risk assessment presentation
- case review
- case escalation
- audit trail
- officer administration
- system administration

This repository is the CURRENT repository.

---

## Repository 2 — SIH2026-mobile

### Officer Mobile Application

Technology:

- Flutter
- Dart

Primary user:

- authorized field/checkpoint officer

Responsibilities:

- officer authentication
- document capture
- passport capture
- image quality guidance
- face capture
- verification submission
- verification processing status
- verification result
- evidence viewing
- officer actions

This repository is separate from the current web repository.

Do NOT create Flutter/mobile code in this repository.

---

## Repository 3 — SIH2026-backend

### Central Backend and AI Platform

Technology direction:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic
- Docker
- Redis where required
- object storage
- PyTorch/OpenCV
- appropriate OCR/ML models
- LLM provider abstraction

Responsibilities:

- authentication
- authorization
- API
- database
- verification orchestration
- document processing
- OCR
- MRZ processing
- document validation
- forensic analysis
- face verification
- liveness
- evidence generation
- evidence storage
- risk engine
- LLM explanation
- audit logging

The backend is the authoritative business-logic layer.

---

# 5. SYSTEM ARCHITECTURE

The high-level architecture is:

                    SIH26188 PLATFORM

       ┌────────────────────┴────────────────────┐
       │                                         │
       ▼                                         ▼

Flutter Officer App Next.js Web App
│ │
└──────────────────┬──────────────────────┘
│
HTTPS / API
│
▼
┌────────────────────┐
│ FastAPI API │
└─────────┬──────────┘
│
Verification Service
│
▼
Verification Orchestrator
│
┌───────────────┼────────────────┐
│ │ │
▼ ▼ ▼
OCR MRZ Forensics
│ │ │
│ │ ▼
│ │ Manipulation
│ │ Detection
│ │
│ ▼
│ Checksum /
│ Consistency
│
└───────────────┬────────────────┘
│
▼
Face Verification
│
▼
Liveness
│
▼
Evidence Layer
│
▼
Risk Engine
│
▼
LLM Explanation
│
▼
Structured Verification
Result
│
┌────────┴────────┐
▼ ▼
Mobile App Web Dashboard

The web and mobile applications MUST NOT directly communicate with each
other.

Both clients communicate through the backend API.

---

# 6. CURRENT REPOSITORY BOUNDARY

This repository is:

> **SIH26188 Web Command Center**

The current repository MUST NOT contain:

- Flutter code
- Dart code
- FastAPI backend code
- PostgreSQL server code
- AI model implementation
- Hugging Face credentials
- LLM API credentials
- production model weights
- backend secrets

The web application is a client of the future backend.

The frontend must not become a second backend.

---

# 7. WEB APPLICATION RESPONSIBILITIES

The web application will eventually provide:

## Authentication

- login
- logout
- session handling
- role-aware navigation
- protected routes

## Dashboard

The dashboard will eventually show real data such as:

- screenings today
- high-risk cases
- medium-risk cases
- pending reviews
- risk distribution
- recent verifications
- recent alerts
- processing metrics

IMPORTANT:

Do NOT invent dashboard numbers.

Until a real backend exists, use honest empty/loading/unavailable states.

Never make fabricated statistics look like real operational data.

---

## Verification Management

The web application will eventually support:

- verification list
- search
- filtering
- sorting
- pagination
- verification details
- processing status
- evidence
- risk assessment
- officer information
- checkpoint information
- timestamps
- review actions

---

## Evidence Investigation

The web application must make evidence understandable.

Potential evidence includes:

- OCR findings
- MRZ findings
- checksum results
- OCR/MRZ inconsistencies
- structural anomalies
- forensic anomalies
- forensic localization
- face verification result
- liveness result
- other verification signals

Evidence should be presented with:

- source
- status
- severity
- confidence where applicable
- explanation
- relevant metadata
- model/version information where appropriate

---

## Case Review

Authorized supervisors may eventually:

- review a case
- acknowledge findings
- escalate a case
- mark a case reviewed
- clear a case where operationally appropriate

Every important human action must be auditable.

---

## Audit Trail

The system must answer:

> Who did what, when, and what did the system report at that time?

Audit events may include:

- authentication events
- verification creation
- processing stages
- AI execution
- risk assessment
- case review
- escalation
- administrative actions

---

# 8. CORE DOMAIN CONCEPT

The central domain object is:

> **Verification**

A verification represents one document/identity screening session.

Conceptually:

    Verification
    │
    ├── identity context
    ├── officer
    ├── device
    ├── checkpoint
    ├── document
    ├── captures
    ├── OCR results
    ├── MRZ results
    ├── validation results
    ├── forensic findings
    ├── biometric findings
    ├── evidence
    ├── risk assessment
    ├── explanation
    └── audit events

The frontend should model this domain without implementing the actual
verification algorithms.

---

# 9. EVIDENCE-FIRST ARCHITECTURE

The system MUST NOT reduce verification to:

    fake = true
    fake = false

Instead, verification engines produce structured evidence.

Example conceptual evidence:

    {
      "id": "EV-001",
      "category": "MRZ",
      "source": "mrz_validator",
      "status": "FAIL",
      "severity": "HIGH",
      "confidence": 0.99,
      "finding": "Date of birth checksum mismatch"
    }

The actual schema will be defined by the backend.

Risk assessments should reference the evidence that contributed to them.

This provides:

- explainability
- traceability
- debugging
- auditability
- better human review

---

# 10. VERIFICATION PIPELINE

The intended passport verification pipeline is:

    Document Capture
          │
          ▼
    Capture Quality Check
          │
          ▼
    Image Preprocessing
          │
          ├───────────────┐
          ▼               ▼
        OCR              MRZ
          │               │
          └───────┬───────┘
                  ▼
          Field Consistency
                  │
                  ▼
          MRZ Validation
                  │
                  ▼
       Document Structural Checks
                  │
                  ▼
          Forensic Analysis
                  │
                  ▼
          Face Verification
                  │
                  ▼
             Liveness
                  │
                  ▼
          Evidence Aggregation
                  │
                  ▼
             Risk Engine
                  │
                  ▼
           LLM Explanation
                  │
                  ▼
          Human Review / Action

Not every stage must execute synchronously.

The backend may eventually use asynchronous processing for expensive AI
operations.

---

# 11. OCR

OCR is responsible for extracting visible document text.

OCR output should eventually include structured information such as:

- field
- value
- confidence
- bounding box
- source/version where appropriate

OCR is NOT the final truth.

OCR output must be compared with other sources where possible.

---

# 12. MRZ

The passport MRZ is a major verification signal.

The backend should eventually:

1. detect the MRZ
2. extract MRZ text
3. parse MRZ fields
4. validate check digits
5. validate field structure
6. compare MRZ fields with visually extracted fields

The frontend should present the resulting evidence rather than reimplement
MRZ validation logic.

---

# 13. OCR ↔ MRZ CONSISTENCY

The system should compare independently extracted representations.

Example:

    Visual DOB: 12/04/2000
    MRZ DOB:    12/04/1998

Result:

    HIGH-SEVERITY INCONSISTENCY

This is an important fraud signal.

Do not assume that consistency alone proves authenticity.

---

# 14. DIGITAL FORENSICS

Forensic analysis asks:

> Does the image contain evidence of manipulation?

It does NOT necessarily determine:

> What was the original value?

Potential forensic signals include:

- compression inconsistencies
- noise inconsistencies
- copy-move manipulation
- splicing
- resampling
- inpainting
- texture inconsistencies
- suspicious boundaries
- rendering/font inconsistencies

Where technically possible, forensic models should produce both:

1. document-level anomaly information
2. localized suspicious regions

The second is valuable for explainability.

---

# 15. FACE VERIFICATION

Face verification answers:

> Does the person presenting the document appear consistent with the
> photograph contained in the document?

The system should use dedicated biometric models rather than an LLM.

Conceptual flow:

    Document Face
         │
         ▼
    Face Embedding
         │
         ├──── Similarity ────┐
         │                    │
         ▼                    ▼
    Live Face             Match Result

Face verification is another evidence source.

It does not independently prove document authenticity.

---

# 16. LIVENESS

Liveness is intended to reduce simple presentation attacks such as showing
a photograph to the camera.

Liveness should be implemented as a dedicated biometric/security component.

Do not use an LLM as a substitute for liveness detection.

---

# 17. RISK ENGINE

The risk engine combines evidence into an explainable risk assessment.

Possible risk levels:

- LOW
- MEDIUM
- HIGH

Possible recommended actions:

- CLEAR
- REVIEW
- MANUAL_VERIFICATION
- ESCALATE

The risk engine should be:

- deterministic where possible
- explainable
- configurable
- testable
- independent from UI code
- independent from LLM output

Example conceptual output:

    {
      "level": "HIGH",
      "score": 82,
      "recommended_action": "MANUAL_VERIFICATION",
      "evidence_ids": [
        "EV-001",
        "EV-004"
      ]
    }

The exact scoring model must be calibrated.

Do NOT present arbitrary weights as scientifically validated.

Do not allow the LLM to modify the authoritative risk score.

---

# 18. LLM ARCHITECTURE

The LLM is an explanation/reasoning-support component.

It is NOT the authoritative fake-document classifier.

Preferred flow:

    Verification Evidence
            │
            ▼
       Risk Engine
            │
            ▼
    Structured Explanation Context
            │
            ▼
           LLM
            │
            ▼
      Structured JSON
            │
            ▼
      Schema Validation
            │
            ▼
        Web / Mobile

The LLM should receive structured evidence rather than unnecessarily
receiving raw sensitive documents.

The LLM may generate:

- concise case summary
- key findings
- explanation of evidence
- recommended review context
- human-readable reasoning

The LLM MUST NOT:

- invent evidence
- invent verification results
- alter authoritative risk scores
- claim certainty unsupported by evidence
- make legal determinations
- bypass deterministic validation

If the LLM is unavailable, the core verification system must still work.

---

# 19. HUGGING FACE / ML ARCHITECTURE

Hugging Face may be used for appropriate ML models.

Potential uses include:

- document understanding
- OCR-related models
- computer vision
- forensic models
- face-related models where appropriate
- other specialized ML models

Do not force Hugging Face into every part of the system.

Use the model/tool best suited to the specific problem.

AI providers should be abstracted.

Conceptually:

    Model Interface
          │
      ┌───┴────┐
      ▼        ▼

Hugging Local
Face Model Model

This allows models to be replaced without rewriting application/domain
logic.

Model names must not be hard-coded throughout the frontend.

---

# 20. FRONTEND AI BOUNDARY

The web application does NOT run authoritative AI inference.

The web application consumes backend results.

Correct:

    Web
      │
      ▼
    Backend
      │
      ▼
    AI Pipeline
      │
      ▼
    Evidence
      │
      ▼
    Web

Incorrect:

    Web Browser
      │
      ├── LLM API key
      ├── Hugging Face secret
      └── model credentials

Never expose AI provider secrets to the browser.

---

# 21. API ARCHITECTURE

The future backend API will be the single integration boundary.

Conceptual endpoints:

    POST   /api/v1/auth/login
    POST   /api/v1/auth/refresh
    GET    /api/v1/me

    GET    /api/v1/dashboard/summary

    POST   /api/v1/verifications
    GET    /api/v1/verifications
    GET    /api/v1/verifications/{id}

    GET    /api/v1/verifications/{id}/evidence

    POST   /api/v1/verifications/{id}/escalate

    POST   /api/v1/verifications/{id}/review

    GET    /api/v1/audit/events

These are conceptual contracts until the backend repository defines the
actual API.

Do NOT create fake API implementations just to make the UI appear real.

---

# 22. API CLIENT

The web application must use a centralized API client.

Do not scatter raw fetch calls throughout components.

The API layer should eventually handle:

- base URL
- authentication
- request headers
- typed responses
- errors
- timeouts where appropriate
- response validation
- consistent error handling

Expected conceptual flow:

    Component
       │
       ▼
    Feature API
       │
       ▼
    API Client
       │
       ▼
    FastAPI Backend

---

# 23. DATA VALIDATION

External data must be validated at application boundaries.

Use Zod on the frontend.

Expected flow:

    API Response
         │
         ▼
       Zod
         │
      Valid?
       /   \
     YES    NO
      │      │
      ▼      ▼
    Typed    Error
    Data

Never blindly assume an API response is correct.

---

# 24. SERVER STATE

Use TanStack Query for server state.

Server state includes:

- dashboard data
- verification records
- evidence
- officer data
- audit events

Do not introduce a global state library unless there is a clear need.

Prefer local state for local UI state.

---

# 25. AUTHENTICATION

Authentication will eventually be provided by the backend.

The frontend may contain:

- login page
- session management
- protected routes
- logout
- role-aware UI

The frontend MUST NOT be the authority for authorization.

Backend authorization is authoritative.

Never implement:

- fake login success
- hardcoded credentials
- bypass authentication
- fake tokens
- fake sessions presented as real

---

# 26. SECURITY

Never commit:

- API keys
- passwords
- access tokens
- refresh tokens
- private certificates
- provider credentials
- database credentials
- `.env` secrets

Never expose backend or AI credentials through public browser variables.

Use environment variables appropriately.

Client-side validation is NOT security.

Server-side authorization is mandatory.

---

# 27. PRIVACY

Identity documents and biometric information are highly sensitive.

The architecture must follow data minimization.

Do not collect information simply because it is technically possible.

Do not log:

- full passport numbers
- raw biometric data
- unnecessary document contents
- authentication secrets

unless there is a specific justified requirement.

Sensitive data should be masked in operational interfaces whenever possible.

Do not use real people's identity documents for development/testing unless
explicitly authorized.

Use synthetic or appropriately authorized test documents.

---

# 28. AUDITABILITY

Important system and user actions must be traceable.

An audit event should conceptually contain:

- event ID
- actor
- action
- resource
- timestamp
- relevant metadata

Audit records should be append-oriented and tamper-resistant in the future
backend architecture.

The UI should never fabricate audit events.

---

# 29. FRONTEND DESIGN SYSTEM

The web application should look like a serious identity/security
operations platform.

Design goals:

- professional
- restrained
- trustworthy
- high contrast
- accessible
- operational
- information-dense where appropriate
- modern without being flashy

Avoid:

- excessive gradients
- excessive glassmorphism
- meaningless animations
- oversized marketing sections
- generic SaaS visuals
- excessive rounded cards
- fake charts
- fake metrics
- decorative elements that reduce usability

Status must never be communicated through color alone.

Use:

- text
- icons
- labels
- semantic colors
- accessible contrast

---

# 30. RESPONSIVE DESIGN

The web application should work across:

- desktop
- laptop
- tablet

The primary use case is an operational desktop dashboard.

Do not sacrifice desktop usability merely to make every screen resemble
a mobile application.

---

# 31. ACCESSIBILITY

Accessibility is a first-class requirement.

Use:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- accessible labels
- meaningful error messages
- status text in addition to color
- appropriate ARIA only where necessary

Do not rely solely on visual cues.

---

# 32. FRONTEND ARCHITECTURE

Prefer feature-oriented organization.

Conceptual structure:

    src/
    ├── app/
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── shared/
    ├── features/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── verifications/
    │   ├── evidence/
    │   └── audit/
    ├── lib/
    │   ├── api/
    │   ├── validation/
    │   └── utils/
    ├── hooks/
    ├── types/
    └── config/

Do not create abstractions without a reason.

Do not create massive components.

Do not put business logic directly inside page components.

---

# 33. COMPONENT PRINCIPLES

Shared components should be genuinely reusable.

Examples:

- Button
- Input
- Dialog
- Badge
- StatusIndicator
- Card
- DataTable
- EmptyState
- LoadingState
- ErrorState
- PageHeader

Domain-specific components belong inside their feature where possible.

Avoid turning every small element into a global component.

---

# 34. ERROR HANDLING

Errors must be explicit and understandable.

The application should distinguish between:

- validation errors
- authentication errors
- authorization errors
- network errors
- backend errors
- unavailable services
- unexpected application errors

Do not silently swallow errors.

Do not display raw stack traces to end users.

Do not replace errors with fake successful states.

---

# 35. LOADING AND EMPTY STATES

Every data-driven page must have intentional states for:

1. loading
2. success
3. empty
4. error

Example:

    VERIFICATIONS

    No verification records are available yet.

This is preferable to showing fabricated records.

---

# 36. REAL DATA ONLY

This is one of the most important project rules.

The application must eventually display real backend data.

Do NOT hard-code:

- dashboard counts
- risk percentages
- verification records
- officer records
- audit events
- AI confidence
- forensic scores
- face similarity
- fake alerts

During development, placeholders must be visually and semantically
identified as placeholders.

Never create fake functionality merely to make screenshots look impressive.

---

# 37. DEVELOPMENT PHASES

The project will progress through controlled milestones.

## W0 — Foundation

- Next.js foundation
- TypeScript
- App Router
- styling
- UI foundation
- project structure
- API client
- Zod
- TanStack Query
- environment configuration
- testing
- linting
- base layouts

No domain AI.

---

## W1 — Web Authentication

- login UI
- backend authentication integration
- session handling
- protected routes
- logout
- role-aware navigation

No fake authentication.

---

## W2 — Backend + Database Contract

This phase involves the separate backend repository.

- FastAPI
- PostgreSQL
- migrations
- authentication
- core domain models
- API contracts
- verification model
- evidence model
- audit model

---

## W3 — Working Dashboard

Connect the web application to real backend data.

Implement:

- dashboard summary
- verification statistics
- recent cases
- loading states
- empty states
- error handling

No fabricated data.

---

## W4 — Verification Management

Implement:

- verification creation/status display
- verification list
- filtering
- search
- pagination
- detail page

---

## W5 — Document Processing

Backend work:

- document ingestion
- OCR
- field extraction
- MRZ detection
- MRZ parsing
- checksum validation
- OCR/MRZ consistency

---

## W6 — Evidence + Risk Engine

Implement:

- evidence aggregation
- deterministic validation
- risk evaluation
- explainable findings
- LOW/MEDIUM/HIGH assessment
- recommended action

---

## W7 — Advanced AI

Implement as appropriate:

- document forensics
- manipulation localization
- face verification
- liveness

---

## W8 — LLM Explanation

Implement:

- evidence-to-context transformation
- LLM provider abstraction
- structured output
- schema validation
- human-readable explanation

The LLM must remain non-authoritative.

---

## W9 — Web Investigation Experience

Implement:

- evidence viewer
- forensic visualization
- case review
- escalation
- audit trail
- investigation workflow

---

## W10 — Flutter Mobile Application

Separate repository.

Implement:

- officer authentication
- document capture
- image quality
- face capture
- verification submission
- processing
- result
- evidence

---

## W11 — Integration + Hardening

- end-to-end workflows
- security
- privacy
- performance
- error recovery
- offline considerations
- model versioning
- deployment
- monitoring
- final testing

---

# 38. TESTING

Testing must focus on meaningful behavior.

Frontend testing should eventually cover:

- API schemas
- API error handling
- authentication state
- route protection
- important feature logic
- UI states
- critical workflows

Backend testing should cover:

- authentication
- authorization
- verification lifecycle
- MRZ validation
- evidence generation
- risk engine
- schema validation
- AI service failure handling
- audit behavior

Do not create meaningless tests solely to increase test count.

---

# 39. AI FAILURE HANDLING

AI services can fail.

The system must gracefully handle:

- model timeout
- provider outage
- invalid model output
- low confidence
- unavailable GPU
- malformed response
- incompatible model version

An AI failure must NOT automatically become:

> "Document is fake."

Instead, represent the unavailable or failed signal explicitly.

Example:

    Forensic Analysis
    Status: UNAVAILABLE

The risk engine must define how unavailable evidence affects the assessment.

---

# 40. MODEL VERSIONING

AI results should eventually be traceable to:

- model name
- model version
- inference version
- timestamp
- configuration where relevant

This is important for reproducibility and auditability.

Do not silently replace models in production without considering
versioning implications.

---

# 41. PERFORMANCE PRINCIPLES

Do not prematurely optimize.

However:

- expensive AI processing should not block the UI unnecessarily
- long-running verification should support asynchronous processing
- large document images should be handled carefully
- unnecessary frontend requests should be avoided
- TanStack Query should be used appropriately for caching

The UI should clearly communicate processing state.

---

# 42. OFFLINE / NETWORK RESILIENCE

The mobile application may eventually operate in environments with
unreliable connectivity.

This is primarily a mobile/backend concern, but the backend contracts
should eventually support clear processing states.

Potential states:

- CREATED
- PROCESSING
- DOCUMENT_PROCESSING
- BIOMETRIC_PROCESSING
- RISK_ASSESSMENT
- COMPLETED
- FAILED
- REVIEW_REQUIRED

Do not implement unnecessary offline infrastructure in the web foundation
unless explicitly requested.

---

# 43. DATABASE PRINCIPLES

The database belongs to the backend repository.

The web application must never connect directly to PostgreSQL.

Correct:

    Web → API → Database

Incorrect:

    Browser → PostgreSQL

The backend owns persistence.

---

# 44. OBJECT STORAGE

Document captures, forensic images, and other large evidence artifacts
should eventually use object storage rather than being embedded directly
inside relational database rows.

The frontend should receive controlled access through backend-authorized
URLs or appropriate secure mechanisms.

Do not expose unrestricted object storage.

---

# 45. API CONTRACT OWNERSHIP

The backend owns authoritative API contracts.

The frontend should consume typed contracts.

When API contracts change:

1. update backend schema
2. update API documentation
3. update frontend types/validation
4. update tests
5. verify both clients

Do not silently compensate for backend contract changes inside random UI
components.

---

# 46. CODE QUALITY

Prefer:

- readable code
- explicit types
- small focused functions
- predictable naming
- modular architecture
- meaningful abstractions
- defensive boundary validation

Avoid:

- clever code
- unnecessary abstraction
- premature microservices
- huge files
- duplicated logic
- magic constants
- hidden side effects
- unnecessary dependencies

---

# 47. DEPENDENCY POLICY

Before adding a dependency, determine whether it is actually necessary.

Prefer mature, well-maintained libraries.

Do not add a library simply because an AI agent commonly uses it.

Avoid overlapping libraries that solve the same problem.

After adding dependencies:

- verify compatibility
- run tests
- run lint
- run typecheck
- run production build

---

# 48. ENVIRONMENT CONFIGURATION

Use environment variables for configuration.

Example:

    NEXT_PUBLIC_API_BASE_URL=

Public browser variables may contain public configuration only.

Never place secrets in:

    NEXT_PUBLIC_*

Secrets belong exclusively on the backend/server side.

Provide appropriate example environment files without real credentials.

---

# 49. GIT DISCIPLINE

Use meaningful commits.

Examples:

    feat: initialize web foundation
    feat: add authentication shell
    feat: add dashboard layout
    feat: add verification management
    feat: integrate verification api
    fix: handle api timeout errors
    refactor: isolate api client

Do not create commits automatically unless explicitly instructed.

Never commit:

- `.env`
- credentials
- tokens
- private keys
- generated sensitive data
- real identity documents

---

# 50. AGENT WORKFLOW

Every task MUST follow this workflow.

## Step 1 — Read Context

Read:

- GEMINI.md
- relevant source files
- relevant configuration
- relevant tests

## Step 2 — Inspect

Understand:

- current architecture
- existing implementation
- dependencies
- affected modules

Do not assume.

## Step 3 — Plan

Before significant changes, provide:

- objective
- implementation approach
- files affected
- dependencies required
- risks

## Step 4 — Implement

Make focused changes.

Do not silently expand scope.

## Step 5 — Validate

Run relevant:

- typecheck
- lint
- tests
- build

## Step 6 — Review

Check:

- architecture
- security
- accessibility
- error handling
- accidental fake functionality
- unnecessary dependencies

## Step 7 — Report

State:

- what changed
- what was tested
- what passed
- what failed
- known limitations
- next recommended step

Never claim success without validation.

---

# 51. SCOPE CONTROL

Agents must not implement future phases simply because the architecture
makes them possible.

For example:

If W0 is requested, do not implement:

- authentication backend
- OCR
- MRZ
- face recognition
- forensics
- risk engine
- LLM
- mobile application

unless explicitly requested.

Architecture preparation is allowed.

Premature implementation is not.

---

# 52. NO FAKE FUNCTIONALITY

This rule overrides the desire for a visually impressive prototype.

Never implement fake:

- authentication
- AI inference
- model output
- risk score
- verification result
- audit event
- database statistic
- API response

If a future feature is not implemented:

Use:

- empty state
- unavailable state
- disabled action
- explicit placeholder
- "Not available yet"

Do not disguise a placeholder as a working system.

---

# 53. HUMAN-IN-THE-LOOP PRINCIPLE

The system is an officer-assistance platform.

A high-risk result means:

> Evidence indicates that additional verification may be required.

It does NOT automatically mean:

> This document is legally fraudulent.

The UI should communicate uncertainty responsibly.

Use language such as:

- Risk detected
- Potential manipulation
- Inconsistency detected
- Manual verification recommended
- Identity mismatch detected
- Evidence unavailable

Avoid unsupported absolute claims.

---

# 54. SECURITY / PRIVACY BY DESIGN

Security and privacy must be considered during architecture rather than
added at the end.

Every feature involving:

- identity data
- biometric data
- documents
- authentication
- evidence
- audit records

must consider:

- access control
- data minimization
- secure transport
- secure storage
- retention
- logging
- masking
- deletion
- authorization

---

# 55. IMPORTANT ARCHITECTURAL INVARIANTS

The following must remain true unless explicitly redesigned:

1. Web and mobile are separate clients.
2. Backend is the authoritative business-logic layer.
3. Web does not connect directly to the database.
4. Mobile does not connect directly to the database.
5. AI inference belongs behind backend boundaries.
6. LLM is not the authoritative authenticity classifier.
7. Risk assessment is evidence-driven.
8. Evidence is traceable.
9. Human review remains part of the workflow.
10. Sensitive information is minimized.
11. Secrets never reach the browser.
12. Fake functionality is prohibited.
13. Future features are not implemented prematurely.
14. API contracts are explicit.
15. Critical behavior is tested.

---

# 56. DEFINITION OF DONE

A feature is considered complete only when:

- the requested functionality works
- architecture remains modular
- types are correct
- boundary data is validated
- errors are handled
- loading/empty states exist where appropriate
- accessibility has been considered
- tests are meaningful
- linting passes
- typechecking passes
- production build passes where applicable
- no secrets are exposed
- no fake functionality has been introduced
- documentation is updated where necessary

"Looks good in the browser" is NOT sufficient.

"Build succeeds" is NOT sufficient.

---

# 57. CURRENT PROJECT STATUS

The current repository is a clean starting point for the SIH26188 web
application.

The current objective is to establish the web platform correctly before
implementing domain-specific verification intelligence.

The project should be developed incrementally.

Do not attempt to build the entire platform in one task.

---

# 58. FINAL ENGINEERING PRINCIPLE

Build a real system.

Do not optimize for a fake demo.

Every architectural decision should move SIH26188 toward a platform in
which:

    Officer
        │
        ▼
    Capture
        │
        ▼
    Verification Pipeline
        │
        ▼
    Evidence
        │
        ▼
    Risk Assessment
        │
        ▼
    Explainable Result
        │
        ▼
    Human Decision
        │
        ▼
    Auditable Record

The final system should be credible enough that each component can be
replaced, tested, audited, and scaled independently.

The objective is not to build an "AI demo."

The objective is to build an **explainable identity-risk screening
platform**.
