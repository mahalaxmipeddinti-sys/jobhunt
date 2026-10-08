import { NormalizedJob } from "../../../types/normalizedJob";

export interface RawJobPayload {
  rawId: string;
  source: string;
  sourceUrl: string;
  data: Record<string, unknown>;
}

export interface ConnectorFetchResult {
  sourceName: string;
  jobs: NormalizedJob[];
  fetchedCount: number;
  normalizedCount: number;
  success: boolean;
  error?: string;
}

export abstract class BaseJobSourceConnector {
  abstract readonly sourceName: string;
  abstract readonly sourceId: string;
  abstract readonly attributionUrl: string;

  /**
   * Fetches and normalizes jobs from this source.
   * Catches errors locally to guarantee failure isolation.
   */
  abstract fetchJobs(): Promise<ConnectorFetchResult>;

  /**
   * Helper to safely sanitize external raw HTML or Markdown
   */
  protected sanitizeText(text?: string): string {
    if (!text) return "";
    return text
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
}
