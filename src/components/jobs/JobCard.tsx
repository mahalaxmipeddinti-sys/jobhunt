import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Job } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Button } from "../ui/button";
import { MapPin, Briefcase, Calendar, Building2 } from "lucide-react";

interface JobCardProps {
  job: Job;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, hasApplied }) => {
  const salaryString =
    job.minSalary && job.maxSalary
      ? `${formatCurrency(job.minSalary)} – ${formatCurrency(job.maxSalary)}`
      : job.minSalary
      ? `From ${formatCurrency(job.minSalary)}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-blue-400/80 hover:shadow-md transition-all"
    >
      <div>
        {/* Company & Department kicker */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-semibold truncate">{job.company}</span>
            {job.department && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="truncate">{job.department}</span>
              </>
            )}
          </div>
          {hasApplied && (
            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md shrink-0">
              Applied
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
          <Link to={`/jobs/${job.id}`} className="focus:outline-none focus:underline">
            {job.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Unboxed Metadata row (zero-pill discipline) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.location}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.employmentType}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.experience}</span>
          {salaryString && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">{salaryString}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer action and date */}
      <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Posted {formatDate(job.postedDate)}</span>
        </div>

        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm" className="font-medium text-xs group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200">
            View Job
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
