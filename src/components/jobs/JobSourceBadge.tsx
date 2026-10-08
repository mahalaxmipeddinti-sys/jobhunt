import React from "react";
import { cn } from "../../lib/utils";
import { Landmark, Globe, CheckCircle2, ShieldCheck, Building } from "lucide-react";

interface JobSourceBadgeProps {
  source: string;
  className?: string;
  showIcon?: boolean;
}

export const JobSourceBadge: React.FC<JobSourceBadgeProps> = ({
  source,
  className,
  showIcon = true,
}) => {
  let icon = <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
  let label = source;
  let bgClass = "bg-slate-100 text-slate-700 border-slate-200/80";

  const s = source.toLowerCase();
  if (s.includes("government") || s.includes("ncs") || s.includes("upsc") || s.includes("ssc")) {
    icon = <Landmark className="w-3.5 h-3.5 text-amber-700" />;
    bgClass = "bg-amber-50 text-amber-900 border-amber-200/70";
    label = s.includes("ncs") ? "National Career Service (Govt)" : "Official Govt Portal";
  } else if (s.includes("arbeitnow")) {
    icon = <Globe className="w-3.5 h-3.5 text-blue-600" />;
    bgClass = "bg-blue-50 text-blue-900 border-blue-200/70";
    label = "Arbeitnow Verified Feed";
  } else if (s.includes("remotive")) {
    icon = <Globe className="w-3.5 h-3.5 text-sky-600" />;
    bgClass = "bg-sky-50 text-sky-900 border-sky-200/70";
    label = "Remotive Public Feed";
  } else if (s.includes("core engineering") || s.includes("silicon")) {
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    bgClass = "bg-emerald-50 text-emerald-900 border-emerald-200/70";
    label = "Engineering Hub Sourced";
  } else if (s.includes("direct")) {
    icon = <Building className="w-3.5 h-3.5 text-indigo-600" />;
    bgClass = "bg-indigo-50 text-indigo-900 border-indigo-200/70";
    label = "JobTrust Direct Employer";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border shadow-2xs",
        bgClass,
        className
      )}
    >
      {showIcon && icon}
      <span className="truncate max-w-[200px]">{label}</span>
    </span>
  );
};
