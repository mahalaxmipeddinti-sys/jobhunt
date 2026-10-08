import { NormalizedJob } from "../../../types/normalizedJob";

export class JobDeduplicator {
  private seenKeys = new Set<string>();

  /**
   * Generates a deterministic deduplication hash key for a job.
   */
  public generateFingerprint(job: Partial<NormalizedJob>): string {
    // 1. Direct match on application_url if present
    if (job.application_url && job.application_url.startsWith("http")) {
      const cleanUrl = job.application_url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .replace(/[?#].*$/, "")
        .replace(/\/$/, "");
      if (cleanUrl.length > 10) {
        return `url:${cleanUrl}`;
      }
    }

    // 2. Normalized Title + Company + Location composite
    const cleanTitle = (job.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 30);
    const cleanCompany = (job.company_name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 25);
    const cleanLoc = (job.location || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);

    return `comp:${cleanCompany}_${cleanTitle}_${cleanLoc}`;
  }

  /**
   * Deduplicates an array of NormalizedJob items.
   * Keeps the most complete or freshest record.
   */
  public deduplicate(jobs: NormalizedJob[]): {
    uniqueJobs: NormalizedJob[];
    duplicateCount: number;
  } {
    const seen = new Map<string, NormalizedJob>();
    let duplicateCount = 0;

    for (const job of jobs) {
      const key = this.generateFingerprint(job);
      if (seen.has(key)) {
        duplicateCount++;
        // Keep the one with longer description or more details
        const existing = seen.get(key)!;
        if (job.description.length > existing.description.length) {
          seen.set(key, job);
        }
      } else {
        seen.set(key, job);
      }
    }

    return {
      uniqueJobs: Array.from(seen.values()),
      duplicateCount,
    };
  }
}
