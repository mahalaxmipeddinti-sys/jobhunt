import { BaseJobSourceConnector, ConnectorFetchResult } from "./baseConnector";
import { NormalizedJob } from "../../../types/normalizedJob";
import { MockStore } from "../../api/mockData";
import { classifyJob } from "../pipeline/classifier";

export class EmployerDirectConnector extends BaseJobSourceConnector {
  readonly sourceName = "JobTrust Direct Employer Network";
  readonly sourceId = "jobtrust_direct";
  readonly attributionUrl = "https://jobtrust.ai/employers";

  async fetchJobs(): Promise<ConnectorFetchResult> {
    const rawJobs = MockStore.getJobs();
    const normalizedJobs: NormalizedJob[] = [];
    const now = new Date().toISOString();

    for (const job of rawJobs) {
      const cleanDesc = this.sanitizeText(job.description);
      const classification = classifyJob(job.title, cleanDesc, [], "it");

      normalizedJobs.push({
        id: job.id,
        source: this.sourceName,
        source_job_id: job.id,
        source_url: job.applicationUrl || `/jobs/${job.id}`,
        title: job.title,
        company_name: job.company,
        company_logo: undefined,
        description: cleanDesc,
        domain: (job.department === "Infrastructure" || job.department === "Engineering") ? "it" : classification.domain,
        category: job.department ? `${job.department} Department` : classification.category,
        role: classification.role,
        location: job.location,
        country: job.location.includes("Remote") ? "Remote" : "USA / Global",
        employment_type: job.employmentType,
        experience_level: job.experience.includes("0-1") ? "Fresher" : (job.experience.includes("5+") ? "5+ years" : "2–5 years"),
        salary_min: job.minSalary,
        salary_max: job.maxSalary,
        salary_currency: "USD",
        skills: classification.skills,
        posted_at: job.postedDate,
        updated_at: job.postedDate,
        first_seen_at: job.postedDate,
        last_seen_at: now,
        last_verified_at: now,
        application_url: `/jobs/${job.id}`,
        status: job.status === "Active" ? "ACTIVE" : "CLOSED",
        created_at: job.postedDate,
      });
    }

    return {
      sourceName: this.sourceName,
      jobs: normalizedJobs,
      fetchedCount: rawJobs.length,
      normalizedCount: normalizedJobs.length,
      success: true,
    };
  }
}
