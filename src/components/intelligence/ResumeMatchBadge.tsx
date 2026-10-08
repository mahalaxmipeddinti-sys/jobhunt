import React, { useState } from "react";
import { ResumeVectorMatcher, MatchAnalysisResult } from "../../lib/intelligence/resumeVectorMatcher";
import { NormalizedJob } from "../../types/normalizedJob";
import { ResumeMatchModal } from "./ResumeMatchModal";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

interface ResumeMatchBadgeProps {
  job: Partial<NormalizedJob>;
  className?: string;
  size?: "sm" | "md";
}

export const ResumeMatchBadge: React.FC<ResumeMatchBadgeProps> = ({
  job,
  className,
  size = "sm",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult>(() =>
    ResumeVectorMatcher.calculateMatch(job)
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80";
    if (score >= 75) return "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100/80";
    if (score >= 60) return "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80";
    return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80";
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsModalOpen(true);
        }}
        title="Candidate Resume Embeddings & Vector Semantic Match Score. Click to inspect breakdown."
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border font-semibold transition-all cursor-pointer select-none",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
          getScoreColor(matchResult.overallScore),
          className
        )}
      >
        <Sparkles className="w-3 h-3 text-blue-600" />
        <span>{matchResult.overallScore}% Vector Match</span>
      </button>

      <ResumeMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        matchResult={matchResult}
        onMatchUpdated={(updated) => setMatchResult(updated)}
      />
    </>
  );
};
