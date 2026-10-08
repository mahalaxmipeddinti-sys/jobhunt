import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { NormalizedJob } from "../../types/normalizedJob";
import { JobSourceBadge } from "./JobSourceBadge";
import { JobFreshness } from "./JobFreshness";
import { LiveJobIndicator } from "./LiveJobIndicator";
import { GhostJobBadge } from "../intelligence/GhostJobBadge";
import { EmployerTrustBadge } from "../intelligence/EmployerTrustBadge";
import { ResumeMatchBadge } from "../intelligence/ResumeMatchBadge";
import { Button } from "../ui/button";
import {
  MapPin,
  Briefcase,
  ExternalLink,
  Building2,
  Award,
} from "lucide-react";

interface AggregatedJobCardProps {
  job: NormalizedJob;
  index?: number;
  hasApplied?: boolean;
}

export const AggregatedJobCard: React.FC<AggregatedJobCardProps> = ({
  job,
  index = 0,
  hasApplied,
}) => {
  const isRecent =
    Date.now() - new Date(job.posted_at).getTime() < 36 * 60 * 60 * 1000;

  const salaryDisplay =
    job.salary_min && job.salary_max
      ? `${job.salary_currency === "INR" ? "₹" : "$"}${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`
      : job.salary_min
      ? `From ${job.salary_currency === "INR" ? "₹" : "$"}${job.salary_min.toLocaleString()}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-blue-400/80 hover:shadow-md transition-all"
    >
      <div>
        {/* Source Badge & Live Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <JobSourceBadge source={job.source} />
            <LiveJobIndicator isNew={isRecent} />
          </div>
          {hasApplied && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Applied
            </span>
          )}
        </div>

        {/* Phase 3, 4, 5 Intelligence Micro-Badges Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* Phase 4: Employer Trust Badge */}
          <EmployerTrustBadge
            companyName={job.company_name}
            source={job.source}
            metrics={job.employer_trust}
            size="sm"
          />

          {/* Phase 3: Ghost-Job Liveness Audit Badge */}
          <GhostJobBadge
            signals={job.ghost_audit}
            jobTitle={job.title}
            companyName={job.company_name}
            source={job.source}
            postedAt={job.posted_at}
            size="sm"
          />

          {/* Phase 5: Candidate Resume Vector Match */}
          <ResumeMatchBadge job={job} size="sm" />
        </div>

        {/* Company & Role Kicker */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5 truncate">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold truncate">{job.company_name}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 truncate">{job.category}</span>
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2.5">
          <Link to={`/jobs/${job.id}`} className="focus:outline-none focus:underline">
            {job.title}
          </Link>
        </h3>

        {/* Snippet */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skills pill-less list */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Unboxed Metadata row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[160px]">{job.location}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.employment_type}</span>
          </div>
          {job.experience_level && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.experience_level}</span>
              </div>
            </>
          )}
          {salaryDisplay && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-900">{salaryDisplay}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer: Date & Dual Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
        <JobFreshness postedAt={job.posted_at} lastVerifiedAt={job.last_verified_at} />

        <div className="flex items-center gap-2">
          {job.source_url && job.source_url.startsWith("http") && (
            <a
              href={job.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 p-1.5 transition-colors"
              title="View original official requisition notice"
            >
              <span className="hidden sm:inline">Original Notice</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <Link to={`/jobs/${job.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200"
            >
              View Job
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
