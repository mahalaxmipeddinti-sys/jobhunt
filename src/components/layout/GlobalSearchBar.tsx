import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jobsApi } from "../../lib/api/jobs";
import { NormalizedJob } from "../../types/normalizedJob";
import {
  Search,
  X,
  MapPin,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
  Command,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

interface GlobalSearchBarProps {
  className?: string;
  placeholder?: string;
  onSelectJob?: (job: NormalizedJob) => void;
}

const POPULAR_SEARCH_CHIPS = [
  "Senior Full Stack",
  "DevOps Engineer",
  "Remote",
  "Bangalore",
  "UPSC Engineering",
  "Hyderabad",
  "Frontend",
  "Data Scientist",
];

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  className = "",
  placeholder = "Search jobs by title, company, or location...",
  onSelectJob,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<NormalizedJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K or '/'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcut if user is already typing in an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await jobsApi.getAggregatedJobs({
          query: trimmed,
          limit: 6,
        });
        setResults(res.jobs);
        setTotalCount(res.total);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (job: NormalizedJob) => {
      setIsOpen(false);
      if (onSelectJob) {
        onSelectJob(job);
      } else {
        navigate(`/jobs/${job.id}`);
      }
    },
    [navigate, onSelectJob]
  );

  const handleViewAllResults = useCallback(
    (searchQuery: string) => {
      setIsOpen(false);
      const encoded = encodeURIComponent(searchQuery.trim());
      navigate(`/jobs?q=${encoded}`);
    },
    [navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) return;
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        handleViewAllResults(query);
      } else {
        navigate("/jobs");
        setIsOpen(false);
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setTotalCount(0);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-lg ${className}`}
    >
      {/* Search Input Box */}
      <div
        className={`group flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-xl border transition-all duration-200 ${
          isOpen
            ? "border-blue-500 shadow-md ring-2 ring-blue-500/20 bg-white"
            : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
        }`}
      >
        <Search
          className={`w-4 h-4 shrink-0 transition-colors ${
            isOpen ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          aria-label="Global search for jobs by title, company, or location"
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Keyboard shortcut hint badge */}
        {!query && (
          <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white/80 border border-slate-200 rounded-md shadow-2xs shrink-0 select-none">
            <span className="text-[11px] leading-none">⌘</span>
            <span>K</span>
          </div>
        )}
      </div>

      {/* Dropdown Results Modal / Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200/90 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Case 1: Loading state */}
          {isLoading && (
            <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Searching verified opportunities...</span>
            </div>
          )}

          {/* Case 2: Has active query with results */}
          {!isLoading && query.trim() && results.length > 0 && (
            <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              <div className="px-3.5 py-2 bg-slate-50/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>
                  Matching Opportunities ({totalCount} found)
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Use ↑ ↓ to navigate · Enter to view
                </span>
              </div>

              {results.map((job, idx) => {
                const isSelected = idx === selectedIndex;
                const isLocationMatch = job.location
                  .toLowerCase()
                  .includes(query.toLowerCase());
                const isCompanyMatch = job.company_name
                  .toLowerCase()
                  .includes(query.toLowerCase());

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelect(job)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50/80 text-blue-900"
                        : "hover:bg-slate-50/80 text-slate-800"
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {job.title}
                        </h4>
                        {job.employer_trust && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {job.employer_trust.tierLabel}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            isCompanyMatch
                              ? "text-blue-700 font-semibold"
                              : "text-slate-700"
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.company_name}
                        </span>

                        <span
                          className={`flex items-center gap-1 ${
                            isLocationMatch
                              ? "text-blue-700 font-semibold"
                              : "text-slate-500"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>

                        {job.employment_type && (
                          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Briefcase className="w-3 h-3" />
                            {job.employment_type}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 pt-0.5">
                      <span className="hidden sm:inline">View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}

              {/* View all matches footer button */}
              <div
                onClick={() => handleViewAllResults(query)}
                className="p-3 bg-slate-50/90 hover:bg-blue-50 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-t border-slate-100"
              >
                <span>
                  View all {totalCount} jobs matching &ldquo;{query}&rdquo;
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Case 3: Has active query but zero results */}
          {!isLoading && query.trim() && results.length === 0 && (
            <div className="p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  No verified jobs found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try searching by different role titles, company names (e.g. &ldquo;Google&rdquo;, &ldquo;Infosys&rdquo;), or Indian cities (e.g. &ldquo;Bangalore&rdquo;, &ldquo;Delhi&rdquo;).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleViewAllResults("")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1 cursor-pointer"
              >
                <span>Browse all active opportunities</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Case 4: Search input is empty -> show quick suggestions / popular searches */}
          {!query.trim() && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Popular Searches:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setQuery(chip);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Ghost-job audited requisitions only
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/jobs");
                    setIsOpen(false);
                  }}
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  All Jobs →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
