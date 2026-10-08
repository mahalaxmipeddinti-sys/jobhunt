import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useRealtime } from "../context/RealtimeContext";
import { candidateApi } from "../lib/api/candidate";
import { Application } from "../types";
import { formatDate } from "../lib/utils";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/ui/status-badge";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import {
  Briefcase,
  FileText,
  User,
  ArrowRight,
  Clock,
  CheckCircle,
  Building2,
  Calendar,
  Sparkles,
  Milestone,
  Layers,
} from "lucide-react";

export const CandidateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { events } = useRealtime();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplications = useCallback(async () => {
    try {
      const data = await candidateApi.getApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Real-time synchronization
  useEffect(() => {
    if (events.length > 0) {
      fetchApplications();
    }
  }, [events, fetchApplications]);

  const stats = {
    total: applications.length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    selected: applications.filter((a) => a.status === "Selected").length,
  };

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Candidate Telemetry & Verified Pipelines Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "Candidate"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your verified applications, ATS sync deliveries, and real-time interview progression.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/resumes">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              My Resumes
            </Button>
          </Link>

          <Link to="/jobs">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              Browse Jobs
            </Button>
          </Link>

          <Link to="/applications">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              My Applications ({applications.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Activity Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Applications
            </span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Direct submissions</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Under Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{stats.underReview}</div>
          <div className="text-[11px] text-slate-400 mt-1">With hiring leads</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Shortlisted
            </span>
            <CheckCircle className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{stats.shortlisted}</div>
          <div className="text-[11px] text-slate-400 mt-1">Advanced to interviews</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Offers Extended
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{stats.selected}</div>
          <div className="text-[11px] text-slate-400 mt-1">Offer extended</div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span>Recent Applications</span>
            <span className="text-xs font-normal text-slate-400">· Real-Time Status</span>
          </h2>
          {applications.length > 0 && (
            <Link
              to="/applications"
              className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              View all ({applications.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : recentApplications.length === 0 ? (
          <EmptyState
            title="You haven't applied to any jobs yet"
            description="Explore authentic openings verified by hiring leads and submit your first application."
            actionLabel="Browse Jobs"
            onAction={() => (window.location.href = "/jobs")}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
            <AnimatePresence initial={false}>
              {recentApplications.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {app.jobTitle}
                      </h3>
                      <StatusBadge status={app.status} size="sm" />

                      {/* Phase 5 Vector Match */}
                      {app.matchScore && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          {app.matchScore}% Match
                        </span>
                      )}

                      {/* Phase 6 ATS Sync Tag */}
                      {app.atsSync && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          <Layers className="w-3 h-3 text-purple-600" />
                          {app.atsSync.atsProvider}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.company}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{app.jobLocation}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied {formatDate(app.appliedDate)}
                      </span>
                      {app.interviewStage && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-semibold text-blue-700 flex items-center gap-1">
                            <Milestone className="w-3 h-3 text-blue-600" />
                            {app.interviewStage}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link to={`/jobs/${app.jobId}`}>
                    <Button variant="outline" size="sm" className="text-xs font-semibold shrink-0 w-full sm:w-auto">
                      View Requisition
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
