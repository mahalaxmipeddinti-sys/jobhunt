import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recruiterApi } from "../../lib/api/recruiter";
import { Job } from "../../types";
import { formatDate } from "../../lib/utils";
import { StatusBadge } from "../../components/ui/status-badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import { toast } from "../../components/ui/toaster";
import {
  PlusCircle,
  Users,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  MapPin,
  Briefcase,
} from "lucide-react";

export const RecruiterJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await recruiterApi.getMyJobs();
      setJobs(data);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    try {
      if (job.status === "Active") {
        await recruiterApi.closeJob(job.id);
        toast.info(`Job "${job.title}" marked as closed.`);
      } else {
        await recruiterApi.reopenJob(job.id);
        toast.success(`Job "${job.title}" reopened for applicants.`);
      }
      await fetchJobs();
    } catch (err: any) {
      toast.error(err.message || "Failed to update job status");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Job Postings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and track status for your company's open opportunities.
          </p>
        </div>

        <Link to="/recruiter/jobs/create">
          <Button variant="primary" size="md" className="gap-1.5 shadow-xs">
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="You haven't posted any jobs yet"
          description="Publish verified job requisitions to attract qualified candidates without recruiter spam."
          actionLabel="Post Your First Job"
          onAction={() => navigate("/recruiter/jobs/create")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {job.title}
                  </h3>
                  <StatusBadge status={job.status} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.employmentType}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{job.experience}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Posted {formatDate(job.postedDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                <Link to={`/recruiter/jobs/${job.id}/applications`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Applicants ({job.applicantCount || 0})
                  </Button>
                </Link>

                <Link to={`/jobs/${job.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs" title="View public page">
                    <Eye className="w-3.5 h-3.5" />
                    Public View
                  </Button>
                </Link>

                <Link to={`/recruiter/jobs/create?edit=${job.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </Link>

                <Button
                  variant={job.status === "Active" ? "subtle" : "outline"}
                  size="sm"
                  onClick={() => handleToggleStatus(job)}
                  className="text-xs"
                >
                  {job.status === "Active" ? (
                    <span className="flex items-center gap-1 text-slate-700">
                      <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      Close Job
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Reopen Job
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
