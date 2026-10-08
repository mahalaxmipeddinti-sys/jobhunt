import { BaseJobSourceConnector } from "../connectors/baseConnector";
import { ArbeitnowConnector } from "../connectors/arbeitnowConnector";
import { RemotiveConnector } from "../connectors/remotiveConnector";
import { NCSGovernmentConnector } from "../connectors/ncsGovernmentConnector";
import { EngineeringRegionalConnector } from "../connectors/engineeringRegionalConnector";
import { EmployerDirectConnector } from "../connectors/employerDirectConnector";
import { JobDeduplicator } from "./deduplicator";
import { jobRepository, JobRepository } from "../storage/jobRepository";
import { NormalizedJob } from "../../../types/normalizedJob";
import { GhostJobAuditor } from "../../intelligence/ghostJobAuditor";
import { EmployerTrustEngine } from "../../intelligence/employerTrustEngine";
import { ResumeVectorMatcher } from "../../intelligence/resumeVectorMatcher";

export interface AggregationRunSummary {
  timestamp: string;
  totalFetched: number;
  totalNormalized: number;
  totalDeduplicated: number;
  totalStored: number;
  sourcesRun: number;
  sourcesSucceeded: number;
  sourcesFailed: number;
}

export class JobAggregationService {
  private connectors: BaseJobSourceConnector[];
  private deduplicator: JobDeduplicator;
  private repository: JobRepository;
  private isSyncing: boolean = false;

  constructor(repository: JobRepository = jobRepository) {
    this.repository = repository;
    this.deduplicator = new JobDeduplicator();

    // Register active connectors
    this.connectors = [
      new NCSGovernmentConnector(),
      new ArbeitnowConnector(),
      new RemotiveConnector(),
      new EngineeringRegionalConnector(),
      new EmployerDirectConnector(),
    ];
  }

  /**
   * Runs the full aggregation pipeline:
   * FETCH -> VALIDATE -> NORMALIZE -> CLASSIFY -> DEDUPLICATE -> STORE -> SERVE
   */
  public async syncAllSources(forceRefresh: boolean = false): Promise<AggregationRunSummary> {
    if (this.isSyncing) {
      console.log("[Aggregator] Sync already in progress, skipping duplicate call.");
      return this.generateSummary([], 0);
    }

    this.isSyncing = true;
    const now = new Date().toISOString();
    console.log(`[Aggregator] Starting live job aggregation across ${this.connectors.length} sources...`);

    const allNormalized: NormalizedJob[] = [];
    let sourcesSucceeded = 0;
    let sourcesFailed = 0;
    let totalRawFetched = 0;

    for (const connector of this.connectors) {
      try {
        console.log(`[Aggregator] Fetching from ${connector.sourceName}...`);
        const result = await connector.fetchJobs();
        totalRawFetched += result.fetchedCount;

        if (result.success && result.jobs.length > 0) {
          sourcesSucceeded++;
          allNormalized.push(...result.jobs);

          this.repository.recordSourceStats({
            sourceName: connector.sourceName,
            status: "healthy",
            lastSuccessfulFetch: now,
            totalFetched: result.fetchedCount,
            totalNormalized: result.normalizedCount,
            totalDeduplicated: 0,
            totalStored: result.jobs.length,
          });
        } else if (result.success && result.jobs.length === 0) {
          sourcesSucceeded++;
        } else {
          sourcesFailed++;
          this.repository.recordSourceStats({
            sourceName: connector.sourceName,
            status: "degraded",
            lastSuccessfulFetch: now,
            lastFailure: result.error || "Zero items returned",
            totalFetched: 0,
            totalNormalized: 0,
            totalDeduplicated: 0,
            totalStored: 0,
          });
        }
      } catch (err: any) {
        sourcesFailed++;
        console.error(`[Aggregator] Isolated failure in connector ${connector.sourceName}:`, err);
        this.repository.recordSourceStats({
          sourceName: connector.sourceName,
          status: "error",
          lastSuccessfulFetch: "",
          lastFailure: err.message,
          totalFetched: 0,
          totalNormalized: 0,
          totalDeduplicated: 0,
          totalStored: 0,
        });
      }
    }

    // Step: Deduplicate across all combined sources
    const { uniqueJobs, duplicateCount } = this.deduplicator.deduplicate(allNormalized);

    // Step: Enrich with Phase 3 (Ghost Liveness), Phase 4 (Employer Trust), Phase 5 (Vector Match)
    for (const job of uniqueJobs) {
      if (!job.ghost_audit) {
        job.ghost_audit = GhostJobAuditor.auditJob(job);
      }
      if (!job.employer_trust) {
        job.employer_trust = EmployerTrustEngine.evaluateEmployer(job);
      }
      if (!job.match_score) {
        const match = ResumeVectorMatcher.calculateMatch(job);
        job.match_score = match.overallScore;
      }
    }

    // Step: Store in repository
    this.repository.saveJobs(uniqueJobs);
    this.isSyncing = false;

    console.log(
      `[Aggregator] Sync complete: ${uniqueJobs.length} unique jobs stored (${duplicateCount} duplicates eliminated).`
    );

    return {
      timestamp: now,
      totalFetched: totalRawFetched,
      totalNormalized: allNormalized.length,
      totalDeduplicated: duplicateCount,
      totalStored: uniqueJobs.length,
      sourcesRun: this.connectors.length,
      sourcesSucceeded,
      sourcesFailed,
    };
  }

  private generateSummary(jobs: NormalizedJob[], totalFetched: number): AggregationRunSummary {
    return {
      timestamp: new Date().toISOString(),
      totalFetched,
      totalNormalized: jobs.length,
      totalDeduplicated: 0,
      totalStored: jobs.length,
      sourcesRun: this.connectors.length,
      sourcesSucceeded: this.connectors.length,
      sourcesFailed: 0,
    };
  }

  /**
   * Ensures data is seeded or synced on startup
   */
  public async ensureData(): Promise<void> {
    const existing = this.repository.getAllJobs();
    if (existing.length === 0) {
      await this.syncAllSources();
    }
  }
}

export const jobAggregator = new JobAggregationService();
