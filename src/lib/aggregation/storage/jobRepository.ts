import { NormalizedJob, JobQueryFilters, JobQueryResult, SourceMonitoringStats } from "../../../types/normalizedJob";

const STORAGE_KEY = "jobtrust_aggregated_jobs_v2";
const STATS_KEY = "jobtrust_source_stats_v2";
const LAST_SYNC_KEY = "jobtrust_last_sync_v2";

export class JobRepository {
  private inMemoryCache: NormalizedJob[] | null = null;
  private sourceStats: Map<string, SourceMonitoringStats> = new Map();
  private lastSyncedAt: string = "";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.inMemoryCache = JSON.parse(raw);
        }
        const statsRaw = localStorage.getItem(STATS_KEY);
        if (statsRaw) {
          const parsed = JSON.parse(statsRaw);
          this.sourceStats = new Map(Object.entries(parsed));
        }
        this.lastSyncedAt = localStorage.getItem(LAST_SYNC_KEY) || "";
      }
    } catch (e) {
      console.warn("[JobRepository] Failed to read from localStorage", e);
    }
  }

  public saveJobs(jobs: NormalizedJob[]): void {
    this.inMemoryCache = jobs;
    this.lastSyncedAt = new Date().toISOString();

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
        localStorage.setItem(LAST_SYNC_KEY, this.lastSyncedAt);
      }
    } catch (e) {
      console.warn("[JobRepository] Storage quota exceeded or disabled", e);
    }
  }

  public recordSourceStats(stats: SourceMonitoringStats): void {
    this.sourceStats.set(stats.sourceName, stats);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const obj = Object.fromEntries(this.sourceStats);
        localStorage.setItem(STATS_KEY, JSON.stringify(obj));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  public getSourceStats(): SourceMonitoringStats[] {
    return Array.from(this.sourceStats.values());
  }

  public getAllJobs(): NormalizedJob[] {
    return this.inMemoryCache || [];
  }

  public getJobById(id: string): NormalizedJob | undefined {
    return this.getAllJobs().find((j) => j.id === id);
  }

  public getLastSyncTime(): string {
    return this.lastSyncedAt || new Date().toISOString();
  }

  /**
   * Powerful composable query engine supporting domain, role, location, state, city,
   * employment_type, experience_level, date_posted, sort_by, and pagination.
   */
  public query(filters: JobQueryFilters = {}): JobQueryResult {
    let list = [...this.getAllJobs()];

    // 1. Keyword search (title, company, description, skills, role)
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company_name.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
      );
    }

    // 2. Domain filter
    if (filters.domain && filters.domain !== "all") {
      const d = filters.domain.toLowerCase();
      if (d === "fresher") {
        list = list.filter((j) => j.domain === "fresher" || j.experience_level === "Fresher");
      } else if (d === "internships") {
        list = list.filter((j) => j.domain === "internships" || j.employment_type === "Internship");
      } else if (d === "remote") {
        list = list.filter((j) => j.domain === "remote" || j.location.toLowerCase().includes("remote"));
      } else if (d === "regional") {
        list = list.filter((j) => Boolean(j.state) || j.country === "India");
      } else {
        list = list.filter((j) => j.domain === d);
      }
    }

    // 3. Role filter
    if (filters.role && filters.role !== "all") {
      const r = filters.role.toLowerCase();
      list = list.filter((j) => j.role.toLowerCase().includes(r) || j.title.toLowerCase().includes(r));
    }

    // 4. Location / State / City filter
    if (filters.location && filters.location !== "all") {
      const loc = filters.location.toLowerCase();
      list = list.filter((j) => j.location.toLowerCase().includes(loc) || j.city?.toLowerCase().includes(loc) || j.state?.toLowerCase().includes(loc));
    }
    if (filters.state) {
      const st = filters.state.toLowerCase();
      list = list.filter((j) => j.state?.toLowerCase() === st);
    }
    if (filters.city) {
      const c = filters.city.toLowerCase();
      list = list.filter((j) => j.city?.toLowerCase() === c);
    }

    // 5. Employment type
    if (filters.employment_type && filters.employment_type !== "all") {
      list = list.filter((j) => j.employment_type.toLowerCase() === filters.employment_type!.toLowerCase());
    }

    // 6. Experience level
    if (filters.experience_level && filters.experience_level !== "all") {
      list = list.filter((j) => j.experience_level === filters.experience_level);
    }

    // 7. Date posted freshness filter
    if (filters.date_posted && filters.date_posted !== "all") {
      const now = Date.now();
      const cutoffMap: Record<string, number> = {
        today: 24 * 60 * 60 * 1000,
        "3days": 3 * 24 * 60 * 60 * 1000,
        "7days": 7 * 24 * 60 * 60 * 1000,
        "30days": 30 * 24 * 60 * 60 * 1000,
      };
      const cutoff = cutoffMap[filters.date_posted];
      if (cutoff) {
        list = list.filter((j) => {
          const postTime = new Date(j.posted_at).getTime();
          return now - postTime <= cutoff;
        });
      }
    }

    // 8. Sorting
    if (filters.sort_by === "recently_updated") {
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (filters.sort_by === "newest" || !filters.sort_by) {
      list.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());
    }

    const total = list.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    const sourcesConnected = Array.from(new Set(this.getAllJobs().map((j) => j.source)));

    return {
      jobs: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      sourcesConnected,
      lastSyncedAt: this.getLastSyncTime(),
    };
  }
}

export const jobRepository = new JobRepository();
