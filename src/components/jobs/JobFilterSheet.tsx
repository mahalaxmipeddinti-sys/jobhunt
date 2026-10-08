import React, { useState } from "react";
import { motion } from "motion/react";
import { JobQueryFilters } from "../../types/normalizedJob";
import { POPULAR_LOCATIONS } from "../../lib/taxonomy/locations";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Filter, RotateCcw, X, Sparkles, ShieldCheck, Ghost } from "lucide-react";

interface JobFilterSheetProps {
  filters: JobQueryFilters;
  onChange: (newFilters: Partial<JobQueryFilters>) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const EMPLOYMENT_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

const EXPERIENCE_OPTIONS = [
  { label: "All Experience Levels", value: "all" },
  { label: "Fresher / Entry (0–1 yrs)", value: "Fresher" },
  { label: "Early Career (0–2 yrs)", value: "0–2 years" },
  { label: "Mid-Level (2–5 yrs)", value: "2–5 years" },
  { label: "Senior / Lead (5+ yrs)", value: "5+ years" },
];

const DATE_OPTIONS = [
  { label: "Any Time", value: "all" },
  { label: "Past 24 Hours", value: "today" },
  { label: "Past 3 Days", value: "3days" },
  { label: "Past Week", value: "7days" },
  { label: "Past Month", value: "30days" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Recently Updated", value: "recently_updated" },
];

export const JobFilterSheet: React.FC<JobFilterSheetProps> = ({
  filters,
  onChange,
  onReset,
  isOpen = false,
  onClose,
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Filter Opportunities</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 gap-1 h-7 px-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Employment Type */}
        <Select
          label="Employment Type"
          options={EMPLOYMENT_OPTIONS}
          value={filters.employment_type || "all"}
          onChange={(e) => onChange({ employment_type: e.target.value })}
        />

        {/* Experience Level */}
        <Select
          label="Experience Level"
          options={EXPERIENCE_OPTIONS}
          value={filters.experience_level || "all"}
          onChange={(e) => onChange({ experience_level: e.target.value })}
        />

        {/* Freshness / Date Posted */}
        <Select
          label="Date Posted"
          options={DATE_OPTIONS}
          value={filters.date_posted || "all"}
          onChange={(e) => onChange({ date_posted: e.target.value as any })}
        />

        {/* Sort By */}
        <Select
          label="Sort Results"
          options={SORT_OPTIONS}
          value={filters.sort_by || "newest"}
          onChange={(e) => onChange({ sort_by: e.target.value as any })}
        />
      </div>

      {/* Popular Regional Hubs with Smooth Hover Gliding Motion */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Popular Tech & Regional Hubs:
        </span>
        <div
          onMouseLeave={() => setHoveredLocation(null)}
          className="relative flex flex-wrap items-center gap-1.5"
        >
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected =
              filters.location?.toLowerCase() === loc.toLowerCase() ||
              (loc === "Remote" && filters.location?.toLowerCase().includes("remote"));
            const isHovered = hoveredLocation === loc;

            return (
              <motion.button
                key={loc}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => setHoveredLocation(loc)}
                onClick={() =>
                  onChange({
                    location: isSelected ? "all" : loc,
                  })
                }
                className={`relative px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border select-none outline-none ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {/* Gliding cursor hover pill */}
                {isHovered && !isSelected && (
                  <motion.div
                    layoutId="filter-location-hover-pill"
                    className="absolute inset-0 bg-blue-50/80 rounded-md -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                      mass: 0.7,
                    }}
                  />
                )}

                <span className="relative z-10">{loc}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // If mobile drawer is requested
  if (isOpen && onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
        <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-xl border border-slate-200 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-base text-slate-900">Advanced Filters</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" size="md" className="w-full" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
      {content}
    </div>
  );
};
