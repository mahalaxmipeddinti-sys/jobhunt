export type NormalizedJobStatus = "ACTIVE" | "CLOSED" | "EXPIRED" | "UNKNOWN";

export type JobDomainId =
  | "all"
  | "government"
  | "it"
  | "engineering"
  | "fresher"
  | "internships"
  | "remote"
  | "regional"
  | "finance"
  | "healthcare"
  | "education"
  | "other";

export type GhostLivenessStatus =
  | "ACTIVELY_HIRING"
  | "NORMAL_CADENCE"
  | "STALE_WARNING"
  | "SUSPECTED_GHOST";

export type EmployerTrustTier = "GOLD" | "SILVER" | "BRONZE" | "FLAGGED";

export interface GhostAuditSignals {
  ghostRiskScore: number;            // 0 - 100%
  livenessStatus: GhostLivenessStatus;
  repostFrequencyDays?: number;
  recruiterResponseRate: number;      // e.g. 96%
  medianResponseHours: number;        // e.g. 36 hours
  careerUrlHealthy: boolean;
  activeApplicantsReviewed: number;
  hiringTeamLastActiveAt: string;
  auditNotes: string[];
}

export interface EmployerTrustMetrics {
  trustScore: number;                 // 0 - 100
  tier: EmployerTrustTier;
  tierLabel: string;
  verifiedDomain: boolean;
  responseRatePercent: number;
  offersConfirmedCount: number;
  candidateRating: number;            // e.g. 4.9
  officialGazetteVerified?: boolean;
  verificationBadgeUrl?: string;
}

export interface NormalizedJob {
  id: string;
  source: string;              // e.g. "Arbeitnow API", "National Career Service", "Remotive Public Feed", "JobTrust Direct"
  source_job_id: string;
  source_url: string;          // Official verification / original URL

  title: string;
  company_name: string;
  company_logo?: string;

  description: string;

  domain: JobDomainId;
  category: string;            // e.g. "Civil Services & UPSC", "Software Development", "Semiconductor & VLSI"
  role: string;                // e.g. "Frontend Developer", "VLSI / Silicon Design Engineer", "Bank PO"

  location: string;
  state?: string;              // e.g. "Telangana", "Andhra Pradesh", "Karnataka"
  city?: string;               // e.g. "Hyderabad", "Visakhapatnam", "Bengaluru"
  country: string;             // e.g. "India", "Remote", "Global"

  employment_type: string;     // Full Time, Part Time, Internship, Contract, Apprenticeship

  experience_min?: number;
  experience_max?: number;
  experience_level?: "Fresher" | "0–2 years" | "2–5 years" | "5+ years";

  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;    // "INR", "USD", "EUR"

  skills: string[];

  posted_at: string;           // ISO timestamp
  updated_at: string;

  first_seen_at: string;
  last_seen_at: string;
  last_verified_at: string;

  application_url: string;
  status: NormalizedJobStatus;

  // Phase 3: Automated Ghost-Job Detection & Requisition Liveness Auditing
  ghost_audit?: GhostAuditSignals;

  // Phase 4: Employer Trust Score & Verification Badge Engine
  employer_trust?: EmployerTrustMetrics;

  // Phase 5: Semantic Match Scoring
  match_score?: number;

  // Phase 6: Direct ATS Integration Available
  ats_provider?: "Greenhouse" | "Lever" | "Workday";

  // Extensible container
  job_scores?: Record<string, unknown>;
  job_ai_analysis?: Record<string, unknown>;

  created_at: string;
}

export interface JobQueryFilters {
  query?: string;
  domain?: string;
  role?: string;
  location?: string;
  state?: string;
  city?: string;
  employment_type?: string;
  experience_level?: string;
  date_posted?: "today" | "3days" | "7days" | "30days" | "all";
  sort_by?: "newest" | "recently_updated" | "relevance" | "trust_score" | "ghost_risk";
  ghost_filter?: "active_only" | "all";
  min_trust_score?: number;
  min_match_score?: number;
  page?: number;
  limit?: number;
}

export interface JobQueryResult {
  jobs: NormalizedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sourcesConnected: string[];
  lastSyncedAt: string;
}

export interface SourceMonitoringStats {
  sourceName: string;
  status: "healthy" | "degraded" | "error";
  lastSuccessfulFetch: string;
  lastFailure?: string;
  totalFetched: number;
  totalNormalized: number;
  totalDeduplicated: number;
  totalStored: number;
}
