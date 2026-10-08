import React from "react";
import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface JobFreshnessProps {
  postedAt: string;
  lastVerifiedAt?: string;
  className?: string;
}

export function formatTimeAgo(isoDate: string): string {
  try {
    const now = Date.now();
    const date = new Date(isoDate).getTime();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(isoDate));
  } catch {
    return "Recently";
  }
}

export const JobFreshness: React.FC<JobFreshnessProps> = ({
  postedAt,
  lastVerifiedAt,
  className,
}) => {
  const timeString = formatTimeAgo(postedAt);

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs text-slate-500", className)}>
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Posted {timeString}</span>
      {lastVerifiedAt && (
        <>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-emerald-700 font-medium">Verified feed</span>
        </>
      )}
    </div>
  );
};
