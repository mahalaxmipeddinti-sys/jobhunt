import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { jobsApi } from "../lib/api/jobs";
import { NormalizedJob, JobQueryFilters, JobQueryResult } from "../types/normalizedJob";
import { AggregatedJobCard } from "../components/jobs/AggregatedJobCard";
import { DomainSelector } from "../components/domains/DomainSelector";
import { RoleSelector } from "../components/domains/RoleSelector";
import { JobFilterSheet } from "../components/jobs/JobFilterSheet";
import { SourceStatusBanner } from "../components/common/SourceStatusBanner";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { useAuth } from "../context/AuthContext";
import { useRealtime } from "../context/RealtimeContext";
import {
  Search,
  MapPin,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { events } = useRealtime();
  const [isPending, startTransition] = useTransition();

  const [jobResult, setJobResult] = useState<JobQueryResult>({
    jobs: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    sourcesConnected: [],
    lastSyncedAt: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialUrlQuery = searchParams.get("q") || searchParams.get("query") || "";

  // Search & Filter State
  const [searchInput, setSearchInput] = useState<string>(initialUrlQuery);
  const [filters, setFilters] = useState<JobQueryFilters>({
    query: initialUrlQuery,
    domain: "all",
    role: "all",
    location: "all",
    employment_type: "all",
    experience_level: "all",
    date_posted: "all",
    sort_by: "newest",
    page: 1,
    limit: 12,
  });

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Listen to external URL query changes (e.g. from header global search bar)
  useEffect(() => {
    const currentParam = searchParams.get("q") || searchParams.get("query") || "";
    if (currentParam !== searchInput) {
      setSearchInput(currentParam);
      setFilters((prev) => ({
        ...prev,
        query: currentParam,
        page: 1,
      }));
    }
  }, [searchParams]);

  // Debounced search input sync
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.query === searchInput) return prev;
        return {
          ...prev,
          query: searchInput,
          page: 1, // reset page on search
        };
      });

      // Update URL query string
      const trimmed = searchInput.trim();
      const currentParam = searchParams.get("q") || searchParams.get("query") || "";
      if (trimmed !== currentParam) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (trimmed) {
              next.set("q", trimmed);
              next.delete("query");
            } else {
              next.delete("q");
              next.delete("query");
            }
            return next;
          },
          { replace: true }
        );
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsApi.getAggregatedJobs(filters);
      startTransition(() => {
        setJobResult(data);
      });

      // Check which jobs candidate has applied to
      if (user && user.role === "candidate") {
        const checkPromises = data.jobs.map(async (job) => {
          const applied = await jobsApi.hasApplied(job.id, user.id);
          return applied ? job.id : null;
        });
        const results = await Promise.all(checkPromises);
        const appliedSet = new Set(results.filter(Boolean) as string[]);
        setAppliedJobIds(appliedSet);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Re-fetch on real-time events
  useEffect(() => {
    if (events.length > 0) {
      fetchJobs();
    }
  }, [events, fetchJobs]);

  const handleDomainChange = (domainId: string) => {
    setFilters((prev) => ({
      ...prev,
      domain: domainId,
      role: "all", // reset role when domain changes
      page: 1,
    }));
  };

  const handleRoleChange = (roleName: string) => {
    setFilters((prev) => ({
      ...prev,
      role: roleName,
      page: 1,
    }));
  };

  const handleFilterUpdate = (updates: Partial<JobQueryFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: 1,
    }));
  };

  const handleResetAll = () => {
    setSearchInput("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        next.delete("query");
        return next;
      },
      { replace: true }
    );
    setFilters({
      query: "",
      domain: "all",
      role: "all",
      location: "all",
      employment_type: "all",
      experience_level: "all",
      date_posted: "all",
      sort_by: "newest",
      page: 1,
      limit: 12,
    });
  };

  const hasActiveFilters =
    Boolean(filters.query) ||
    filters.domain !== "all" ||
    filters.role !== "all" ||
    filters.location !== "all" ||
    filters.employment_type !== "all" ||
    filters.experience_level !== "all" ||
    filters.date_posted !== "all";

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Source Monitoring Status */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Live Job Discovery Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Aggregating legitimate public feeds, official government portals, semiconductor hubs, and verified employers in real-time.
          </p>
        </div>

        {/* Live Source Status Banner */}
        <SourceStatusBanner onRefreshCompleted={fetchJobs} />
      </div>

      {/* Domain Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <DomainSelector
          selectedDomain={filters.domain || "all"}
          onSelectDomain={handleDomainChange}
        />

        {/* Role Sub-selector for selected domain */}
        <RoleSelector
          selectedDomain={filters.domain || "all"}
          selectedRole={filters.role || "all"}
          onSelectRole={handleRoleChange}
        />
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by role (e.g. 'VLSI', 'Frontend', 'UPSC'), company, or skill..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
              className="gap-2 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="md"
                onClick={handleResetAll}
                className="text-xs text-slate-500 hover:text-slate-900 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Composable Filters Sheet */}
        {isFilterSheetOpen && (
          <JobFilterSheet
            filters={filters}
            onChange={handleFilterUpdate}
            onReset={handleResetAll}
          />
        )}
      </div>

      {/* Query Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{jobResult.jobs.length}</strong> of <strong>{jobResult.total}</strong> opportunities
        </span>
        {filters.domain !== "all" && (
          <span className="text-slate-600 font-semibold capitalize">
            Domain: {filters.domain}
          </span>
        )}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-slate-200/80 space-y-4"
            >
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <div className="pt-3 flex gap-2 border-t border-slate-100">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load live job feeds"
          message={error}
          onRetry={fetchJobs}
        />
      ) : jobResult.jobs.length === 0 ? (
        <EmptyState
          title="No matching job vacancies found"
          description="Try broadening your role query, clearing location filters, or exploring all domains."
          actionLabel="Reset All Filters"
          onAction={handleResetAll}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobResult.jobs.map((job, idx) => (
              <AggregatedJobCard
                key={job.id}
                job={job}
                index={idx}
                hasApplied={appliedJobIds.has(job.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {jobResult.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200/80">
              <Button
                variant="outline"
                size="sm"
                disabled={jobResult.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, (prev.page || 1) - 1),
                  }))
                }
                className="gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>

              <span className="text-xs font-semibold text-slate-700 px-3">
                Page {jobResult.page} of {jobResult.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={jobResult.page >= jobResult.totalPages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(jobResult.totalPages, (prev.page || 1) + 1),
                  }))
                }
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
