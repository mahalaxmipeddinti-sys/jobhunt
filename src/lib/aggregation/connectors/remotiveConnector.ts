import { BaseJobSourceConnector, ConnectorFetchResult } from "./baseConnector";
import { NormalizedJob } from "../../../types/normalizedJob";
import { classifyJob } from "../pipeline/classifier";

export class RemotiveConnector extends BaseJobSourceConnector {
  readonly sourceName = "Remotive Verified Feed";
  readonly sourceId = "remotive";
  readonly attributionUrl = "https://remotive.com";

  private readonly API_URL = "https://remotive.com/api/remote-jobs?limit=25";

  async fetchJobs(): Promise<ConnectorFetchResult> {
    try {
      const response = await fetch(this.API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "JobTrustAI-Aggregator/2.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Remotive API returned HTTP ${response.status}`);
      }

      const json = await response.json();
      const rawList = Array.isArray(json.jobs) ? json.jobs : [];

      const normalizedJobs: NormalizedJob[] = [];
      const now = new Date().toISOString();

      for (const item of rawList.slice(0, 25)) {
        if (!item.title || !item.company_name) continue;

        const cleanDesc = this.sanitizeText(item.description);
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const classification = classifyJob(item.title, cleanDesc, tags, "remote");

        normalizedJobs.push({
          id: `rem-${item.id || Math.random().toString(36).slice(2, 9)}`,
          source: this.sourceName,
          source_job_id: String(item.id || ""),
          source_url: item.url || this.attributionUrl,
          title: item.title.trim(),
          company_name: item.company_name.trim(),
          company_logo: item.company_logo || undefined,
          description: cleanDesc.slice(0, 3000),
          domain: "remote",
          category: classification.category,
          role: classification.role,
          location: "Remote (Worldwide)",
          country: "Remote",
          employment_type: item.job_type === "full_time" ? "Full Time" : "Contract",
          experience_level: "2–5 years",
          salary_currency: item.salary ? "USD" : undefined,
          skills: classification.skills,
          posted_at: item.publication_date ? new Date(item.publication_date).toISOString() : now,
          updated_at: now,
          first_seen_at: now,
          last_seen_at: now,
          last_verified_at: now,
          application_url: item.url || this.attributionUrl,
          status: "ACTIVE",
          created_at: now,
        });
      }

      return {
        sourceName: this.sourceName,
        jobs: normalizedJobs,
        fetchedCount: rawList.length,
        normalizedCount: normalizedJobs.length,
        success: true,
      };
    } catch (err: any) {
      console.warn(`[RemotiveConnector] Error fetching live jobs:`, err.message);
      return {
        sourceName: this.sourceName,
        jobs: [],
        fetchedCount: 0,
        normalizedCount: 0,
        success: false,
        error: err.message,
      };
    }
  }
}
