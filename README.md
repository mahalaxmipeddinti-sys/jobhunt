# JobTrust AI - Verified Job Discovery & Autonomous ATS Hiring Engine

![JobTrust AI Banner](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-cyan?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=for-the-badge&logo=vite)

**JobTrust AI** is an intelligent, high-integrity hiring platform engineered to eliminate ghost jobs, verify employer authenticity, calculate semantic resume vector match scores, and streamline recruiter pipeline workflows with real-time application streaming and automated ATS webhook synchronization.

---

## 🌟 Key Features

### 1. Multi-Source Job Aggregation & Normalized Taxonomy
- Seamless ingestion and normalization of positions across National Career Service (NCS), State Government Portals (UPSC, TNPSC, APPSC), Direct Employer Networks, and verified tech partners.
- Dynamic classification into standardized domain and role hierarchies with fuzzy and exact skill tagging.

### 2. Autonomous Ghost-Job Detection & Requisition Liveness Auditing
- Algorithmic scoring of job postings based on posting freshness, employer responsiveness, application throughput, and official requisition URLs.
- Flags inactive, stale, or phantom postings before candidates invest time applying.

### 3. Employer Trust Score & Verification Engine
- Evaluates companies across official gazette registration, verified recruiter domain identity, hiring response rate, and active requisition ratios.
- Awards Gold, Silver, and Bronze trust badges.

### 4. Semantic Resume Vector Alignment
- Local 64-dimensional semantic embedding alignment engine comparing candidate profile credentials against requisition competencies.
- Provides granular scoring across skills overlap, seniority fit, bridgeable gaps, and auto-generates tailored application pitches.

### 5. Enterprise ATS Hub & Webhook Integrations
- Bi-directional sync endpoints supporting Greenhouse, Lever, and Workday data schemas.
- Autonomous background webhook delivery and candidate ID indexing.

### 6. Dynamic Persona-Based Workspace
- Role-based sidebar navigation (`.sidebar-nav-container`) that automatically excludes administrative recruiter hubs from candidate views.
- Real-time applicant live streaming with instant status broadcast and candidate progress tracking.

### 7. Instant Global Search
- Header search bar with keyboard shortcut (`⌘K` / `/`) enabling sub-millisecond filtering across job titles, company names, and locations with rich dropdown previews.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone repository
git clone https://github.com/<your-username>/jobtrust-ai.git
cd jobtrust-ai

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will run on `http://localhost:3000`.

### Building for Production

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── auth/              # Authentication wrappers & protected routes
│   ├── common/            # Reusable UI states (Empty, Error, Skeletons)
│   ├── domains/           # Interactive domain & role selector controls
│   ├── intelligence/      # Ghost-job badge, trust dossier, vector matcher modals
│   ├── jobs/              # Aggregated job cards & filter drawers
│   ├── layout/            # Navbar, GlobalSearchBar, AppShell, Sidebar, Footer
│   └── ui/                # Core accessible UI components (Buttons, Inputs, Dialogs)
├── context/
│   ├── AuthContext.tsx    # Role simulation (Candidate vs Recruiter)
│   └── RealtimeContext.tsx# Live applicant stream & notification dispatch
├── lib/
│   ├── aggregation/       # Multi-source connectors, normalizer, repository
│   ├── api/               # API clients for jobs, candidates, and recruiters
│   ├── integrations/      # ATS webhook connectors (Greenhouse, Lever, Workday)
│   ├── intelligence/      # GhostJobAuditor, EmployerTrustEngine, ResumeVectorMatcher
│   └── taxonomy/          # Domains, roles, categories, and regional locations
├── pages/
│   ├── recruiter/         # Recruiter workspace, requisition hub, candidate pipelines
│   ├── ApplicationsPage   # Active candidate applications & progress tracker
│   ├── CandidateDashboard # Applicant activity metrics & pipeline timeline
│   ├── JobDetailsPage     # Requisition view with origin verification & direct apply
│   ├── JobsPage           # Comprehensive faceted job search engine
│   ├── LearningPage       # Skill gap bridging roadmap & curriculum tracks
│   ├── NotFoundPage       # Friendly fallback 404 handler
│   ├── ProfilePage        # User profile & organization preferences
│   ├── ResumeAnalysisPage # Dedicated job-specific semantic alignment studio
│   └── ResumesPage        # Vector embedding resume profile builder
└── types/                 # TypeScript interfaces and normalization schemas
```

---

## 🛡️ License

This project is licensed under the MIT License.
