import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { candidateApi } from "../lib/api/candidate";
import { Application, ApplicationStatus } from "../types";
import { formatDate } from "../lib/utils";
import { StatusBadge } from "../components/ui/status-badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { MotionSegmentedControl } from "../components/ui/motion-tabs";
import { useRealtime } from "../context/RealtimeContext";
import {
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  Radio,
  Sparkles,
  Layers,
  MessageSquare,
  Milestone,
  CheckCircle2,
  Search,
} from "lucide-react";

const STATUS_FILTERS: (ApplicationStatus | "All")[] = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Selected",
  "Rejected",
];

export const ApplicationsPage: React.FC = () => {
  const { events } = useRealtime();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentUpdatedId, setRecentUpdatedId] = useState<string | null>(null);

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

  // Handle real-time incoming status update or application event
  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0];
      setRecentUpdatedId(latest.applicationId);
      fetchApplications();

      const timer = setTimeout(() => {
        setRecentUpdatedId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [events, fetchApplications]);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      selectedStatus === "All" || app.status === selectedStatus;
    const matchesQuery =
      !searchQuery.trim() ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const filterOptions = STATUS_FILTERS.map((status) => ({
    value: status,
    label: status,
    count:
      status === "All"
        ? applications.length
        : applications.filter((a) => a.status === status).length,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-Time Synchronized Candidate Applications</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Applications ({applications.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track interview pipelines, vector match scores, recruiter feedback, and ATS sync status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link to="/resumes">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              My Resumes
            </Button>
          </Link>

          <Link to="/jobs">
            <Button variant="primary" size="sm" className="text-xs font-semibold">
              Discover Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="overflow-x-auto pb-1">
          <MotionSegmentedControl
            idPrefix="app-status-filter"
            size="sm"
            options={filterOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
          />
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by job or company..."
            className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title={
            selectedStatus === "All"
              ? "You haven't applied to any jobs yet"
              : `No applications matching status '${selectedStatus}'`
          }
          description="Browse authentic verified positions on JobTrust AI and submit applications with instant vector match and ATS sync."
          actionLabel="Find Opportunities"
          onAction={() => (window.location.href = "/jobs")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          <AnimatePresence initial={false}>
            {filteredApplications.map((app) => {
              const isRecentlyUpdated = recentUpdatedId === app.id;

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: isRecentlyUpdated
                      ? "rgba(236, 253, 245, 0.9)"
                      : "rgba(255, 255, 255, 1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors relative"
                >
                  {isRecentlyUpdated && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full animate-pulse">
                      <Radio className="w-2.5 h-2.5" />
                      Updated Real-Time
                    </div>
                  )}

                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">
                        {app.jobTitle}
                      </h3>
                      <StatusBadge status={app.status} />

                      {/* Phase 5 Vector Match Score */}
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
                          {app.atsSync.atsProvider}: {app.atsSync.candidateAtsId}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.company}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.jobLocation}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {app.employmentType}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Submitted {formatDate(app.appliedDate)}
                      </span>
                    </div>

                    {/* Interview Stage Bar */}
                    {app.interviewStage && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Milestone className="w-3.5 h-3.5 text-blue-600" />
                          Current Stage:
                        </span>
                        <span className="font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px]">
                          {app.interviewStage}
                        </span>
                      </div>
                    )}

                    {/* Recruiter Feedback Box */}
                    {app.recruiterFeedback && (
                      <div className="text-xs text-slate-700 bg-amber-50/70 border border-amber-200/80 p-3 rounded-lg flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-900 block mb-0.5">Recruiter Feedback:</strong>
                          <span>{app.recruiterFeedback}</span>
                        </div>
                      </div>
                    )}

                    {/* Submission Note */}
                    {app.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        <strong className="text-slate-700">Submission Pitch:</strong> {app.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    <Link to={`/jobs/${app.jobId}`}>
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        View Requisition
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
