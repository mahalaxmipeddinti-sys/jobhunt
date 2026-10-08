import { delay, ApiError, USE_REAL_BACKEND, apiClient } from "./client";
import { MockStore } from "./mockData";
import { Application, Job, JobFilters } from "../../types";
import {
  NormalizedJob,
  JobQueryFilters,
  JobQueryResult,
  SourceMonitoringStats,
} from "../../types/normalizedJob";
import { jobRepository } from "../aggregation/storage/jobRepository";
import { jobAggregator, AggregationRunSummary } from "../aggregation/pipeline/aggregator";
import { JOB_DOMAINS } from "../taxonomy/domains";
import { JOB_ROLES } from "../taxonomy/roles";
import { REGIONAL_LOCATIONS } from "../taxonomy/locations";
import { ResumeVectorMatcher } from "../intelligence/resumeVectorMatcher";
import { AtsConnectorService } from "../integrations/atsConnector";

export const jobsApi = {
  /**
   * Initializes and ensures data is synced on first call
   */
  async init(): Promise<void> {
    await jobAggregator.ensureData();
  },

  /**
   * Primary Phase 2 Real-Time Job Discovery Query
   */
  async getAggregatedJobs(filters: JobQueryFilters = {}): Promise<JobQueryResult> {
    await jobAggregator.ensureData();

    if (USE_REAL_BACKEND) {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.domain) params.append("domain", filters.domain);
      if (filters.role) params.append("role", filters.role);
      if (filters.location) params.append("location", filters.location);
      if (filters.employment_type) params.append("employment_type", filters.employment_type);
      if (filters.experience_level) params.append("experience_level", filters.experience_level);
      if (filters.date_posted) params.append("date_posted", filters.date_posted);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
      return apiClient<JobQueryResult>(`/api/jobs?${params.toString()}`);
    }

    await delay(120);
    return jobRepository.query(filters);
  },

  /**
   * Fetch a single job by ID (checks repository first, then legacy store)
   */
  async getJobById(jobId: string): Promise<NormalizedJob> {
    await jobAggregator.ensureData();

    if (USE_REAL_BACKEND) {
      return apiClient<NormalizedJob>(`/api/jobs/${jobId}`);
    }

    await delay(100);
    const job = jobRepository.getJobById(jobId);
    if (job) return job;

    // Check if it's a legacy job in MockStore
    const legacyJobs = MockStore.getJobs();
    const found = legacyJobs.find((j) => j.id === jobId);
    if (found) {
      const now = new Date().toISOString();
      return {
        id: found.id,
        source: "JobTrust Direct Employer Network",
        source_job_id: found.id,
        source_url: found.applicationUrl || `/jobs/${found.id}`,
        title: found.title,
        company_name: found.company,
        description: found.description,
        domain: "it",
        category: found.department || "General",
        role: "Software Engineer",
        location: found.location,
        country: "USA / Global",
        employment_type: found.employmentType,
        experience_level: "2–5 years",
        salary_min: found.minSalary,
        salary_max: found.maxSalary,
        salary_currency: "USD",
        skills: ["TypeScript", "React", "PostgreSQL"],
        posted_at: found.postedDate,
        updated_at: found.postedDate,
        first_seen_at: found.postedDate,
        last_seen_at: now,
        last_verified_at: now,
        application_url: `/jobs/${found.id}`,
        status: found.status === "Active" ? "ACTIVE" : "CLOSED",
        created_at: found.postedDate,
      };
    }

    throw new ApiError("Job opportunity not found", 404);
  },

  /**
   * Triggers a live sync across all registered connectors
   */
  async syncSources(force: boolean = false): Promise<AggregationRunSummary> {
    return jobAggregator.syncAllSources(force);
  },

  /**
   * Source health and monitoring observability stats
   */
  getSourceStatus(): SourceMonitoringStats[] {
    return jobRepository.getSourceStats();
  },

  /**
   * Taxonomy lookup endpoints
   */
  getDomains() {
    return JOB_DOMAINS;
  },

  getRoles(domainId?: string) {
    if (!domainId || domainId === "all") return JOB_ROLES;
    return JOB_ROLES.filter((r) => r.domainId === domainId);
  },

  getLocations() {
    return REGIONAL_LOCATIONS;
  },

  /**
   * Apply to any job (handles both direct internal postings and external portal tracks)
   */
  async applyToJob(jobId: string, notes?: string): Promise<Application> {
    if (USE_REAL_BACKEND) {
      return apiClient<Application>(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      });
    }

    await delay(250);
    const currentUser = MockStore.getCurrentUser();
    if (!currentUser) {
      throw new ApiError("Please log in as a candidate to submit an application.", 401);
    }
    if (currentUser.role !== "candidate") {
      throw new ApiError("Only candidate accounts can submit job applications.", 403);
    }

    // Try finding in repository
    const normJob = jobRepository.getJobById(jobId);
    const legacyJob = MockStore.getJobs().find((j) => j.id === jobId);

    if (!normJob && !legacyJob) {
      throw new ApiError("Job opportunity not found", 404);
    }

    const jobTitle = normJob ? normJob.title : legacyJob!.title;
    const company = normJob ? normJob.company_name : legacyJob!.company;
    const location = normJob ? normJob.location : legacyJob!.location;
    const empType = normJob ? normJob.employment_type : legacyJob!.employmentType;

    const applications = MockStore.getApplications();
    const existing = applications.find(
      (a) => a.jobId === jobId && a.applicantId === currentUser.id
    );
    if (existing) {
      throw new ApiError("You have already submitted an application for this position.", 400);
    }

    const candProfiles = MockStore.getCandidateProfiles();
    const profile = candProfiles[currentUser.id];

    // Phase 5: Compute real-time vector semantic match
    const targetJob = normJob || { title: jobTitle, description: "", skills: [] };
    const matchResult = ResumeVectorMatcher.calculateMatch(targetJob);

    const now = new Date().toISOString();
    const candidateAtsId = `GH-CAND-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      company,
      jobLocation: location,
      employmentType: empType,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantPhone: profile?.phone || "",
      appliedDate: now,
      status: "Applied",
      notes: notes?.trim() || undefined,
      matchScore: matchResult.overallScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      interviewStage: "Application Received & Logged",
      atsSync: {
        status: "synced",
        atsProvider: "Greenhouse",
        candidateAtsId,
        syncedAt: now,
        webhookDelivered: true,
        atsRequisitionCode: `REQ-${jobId.slice(-4).toUpperCase()}`,
      },
    };

    // Record webhook log
    AtsConnectorService.addWebhookLog({
      id: `wh-${Date.now()}`,
      timestamp: now,
      provider: "Greenhouse",
      event: "candidate.application.created",
      candidateName: currentUser.name,
      jobTitle,
      payloadPreview: JSON.stringify({
        ats_candidate_id: candidateAtsId,
        job_id: jobId,
        applicant: currentUser.name,
        email: currentUser.email,
        match_score: matchResult.overallScore,
      }),
      status: "delivered_200",
    });

    MockStore.saveApplications([newApp, ...applications]);

    // If legacy job, increment count
    if (legacyJob) {
      legacyJob.applicantCount = (legacyJob.applicantCount || 0) + 1;
      MockStore.saveJobs(MockStore.getJobs());
    }

    return newApp;
  },

  async hasApplied(jobId: string, candidateId?: string): Promise<boolean> {
    if (!candidateId) {
      const user = MockStore.getCurrentUser();
      if (!user) return false;
      candidateId = user.id;
    }
    const applications = MockStore.getApplications();
    return applications.some(
      (a) => a.jobId === jobId && a.applicantId === candidateId
    );
  },

  /**
   * Backward compatibility for Phase 1 components
   */
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    const result = await this.getAggregatedJobs({
      query: filters?.query,
      location: filters?.location,
      employment_type: filters?.employmentType === "All" ? undefined : filters?.employmentType,
    });

    return result.jobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company_name,
      location: j.location,
      employmentType: j.employment_type as any,
      experience: j.experience_level || "2–5 years",
      minSalary: j.salary_min,
      maxSalary: j.salary_max,
      description: j.description,
      applicationUrl: j.application_url,
      status: j.status === "ACTIVE" ? "Active" : "Closed",
      postedDate: j.posted_at,
      recruiterId: "system",
      applicantCount: 5,
      department: j.category,
    }));
  },
};
