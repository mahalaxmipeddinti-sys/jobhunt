import React from "react";
import { ApplicationStatus, JobStatus } from "../../types";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus | JobStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "md",
}) => {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  let dotColor = "bg-slate-400";
  let textColor = "text-slate-700";
  let bgColor = "bg-slate-100";
  let label = status;

  switch (normalized) {
    case "APPLIED":
      dotColor = "bg-blue-500";
      textColor = "text-blue-700";
      bgColor = "bg-blue-50 border border-blue-200/60";
      label = "Applied";
      break;
    case "UNDER_REVIEW":
      dotColor = "bg-amber-500";
      textColor = "text-amber-800";
      bgColor = "bg-amber-50 border border-amber-200/60";
      label = "Under Review";
      break;
    case "SHORTLISTED":
      dotColor = "bg-indigo-500";
      textColor = "text-indigo-800";
      bgColor = "bg-indigo-50 border border-indigo-200/60";
      label = "Shortlisted";
      break;
    case "SELECTED":
      dotColor = "bg-emerald-500";
      textColor = "text-emerald-800";
      bgColor = "bg-emerald-50 border border-emerald-200/60";
      label = "Selected";
      break;
    case "REJECTED":
      dotColor = "bg-rose-400";
      textColor = "text-rose-700";
      bgColor = "bg-rose-50 border border-rose-200/60";
      label = "Rejected";
      break;
    case "ACTIVE":
      dotColor = "bg-emerald-500";
      textColor = "text-emerald-800";
      bgColor = "bg-emerald-50 border border-emerald-200/60";
      label = "Active";
      break;
    case "CLOSED":
      dotColor = "bg-slate-400";
      textColor = "text-slate-600";
      bgColor = "bg-slate-100 border border-slate-200";
      label = "Closed";
      break;
    default:
      dotColor = "bg-slate-400";
      textColor = "text-slate-700";
      bgColor = "bg-slate-100 border border-slate-200";
      label = status;
  }

  const sizeClasses =
    size === "sm" ? "text-xs py-0.5 px-2" : "text-xs py-1 px-2.5";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-md",
        bgColor,
        textColor,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      {label}
    </span>
  );
};
