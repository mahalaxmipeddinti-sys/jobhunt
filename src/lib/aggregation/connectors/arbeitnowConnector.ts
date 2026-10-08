import { BaseJobSourceConnector, ConnectorFetchResult } from "./baseConnector";
import { NormalizedJob } from "../../../types/normalizedJob";
import { classifyJob } from "../pipeline/classifier";

export class ArbeitnowConnector extends BaseJobSourceConnector {
  readonly sourceName = "Arbeitnow Verified API";
  readonly sourceId = "arbeitnow";
  readonly attributionUrl = "https://www.arbeitnow.com";

  private readonly API_URL = "https://www.arbeitnow.com/api/job-board-api";

  async fetchJobs(): Promise<ConnectorFetchResult> {
    try {
      const response = await fetch(this.API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "JobTrustAI-Aggregator/2.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Arbeitnow API returned HTTP ${response.status}`);
      }

      const json = await response.json();
      const rawList = Array.isArray(json.data) ? json.data : [];

      const normalizedJobs: NormalizedJob[] = [];

      for (const item of rawList.slice(0, 40)) {
        if (!item.title || !item.company_name) continue;

        const cleanDesc = this.sanitizeText(item.description);
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const isRemote = Boolean(item.remote);
        const locationStr = isRemote ? "Remote" : (item.location || "Hybrid / Remote");

        const classification = classifyJob(item.title, cleanDesc, tags, isRemote ? "remote" : undefined);

        const now = new Date().toISOString();
        const postedAt = item.created_at
          ? new Date(item.created_at * 1000).toISOString()
          : now;

        normalizedJobs.push({
          id: `arb-${item.slug || item.id || Math.random().toString(36).slice(2, 9)}`,
          source: this.sourceName,
          source_job_id: String(item.slug || item.id || ""),
          source_url: item.url || this.attributionUrl,
          title: item.title.trim(),
          company_name: item.company_name.trim(),
          company_logo: undefined,
          description: cleanDesc.slice(0, 3000),
          domain: classification.domain,
          category: classification.category,
          role: classification.role,
          location: locationStr,
          country: isRemote ? "Global / Remote" : "International",
          employment_type: item.job_types?.[0] || "Full Time",
          experience_level: item.title.toLowerCase().includes("senior") ? "5+ years" : "2–5 years",
          skills: classification.skills,
          posted_at: postedAt,
          updated_at: postedAt,
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
      console.warn(`[ArbeitnowConnector] Error fetching live jobs:`, err.message);
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
