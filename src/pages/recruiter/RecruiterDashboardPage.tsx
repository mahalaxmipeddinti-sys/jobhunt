import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useRealtime } from "../../context/RealtimeContext";
import { recruiterApi, RecruiterDashboardStats } from "../../lib/api/recruiter";
import { formatDate } from "../../lib/utils";
import { StatusBadge } from "../../components/ui/status-badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Briefcase,
  Users,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  Zap,
  Radio,
  Sparkles,
  Award,
} from "lucide-react";
import { toast } from "../../components/ui/toaster";

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { events, simulateIncomingApplication } = useRealtime();
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isBatchSimulating, setIsBatchSimulating] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await recruiterApi.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Update whenever a real-time application is submitted
  useEffect(() => {
    if (events.length > 0) {
      fetchStats();
    }
  }, [events, fetchStats]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const newApp = await simulateIncomingApplication();
      await fetchStats();
      toast.success(`Live candidate application received from ${newApp.applicantName}!`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleBatchSimulate = async () => {
    setIsBatchSimulating(true);
    try {
      toast.info("Generating a batch burst of 5 live candidate applications...");
      for (let i = 0; i < 5; i++) {
        await simulateIncomingApplication();
        await new Promise((r) => setTimeout(r, 200));
      }
      await fetchStats();
      toast.success("Successfully streamed 5 live applicant submissions!");
    } finally {
      setIsBatchSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Real-Time Application Stream Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Recruiter Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Managing verified openings for <strong>{user?.companyName || "Organization"}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulate}
            isLoading={isSimulating}
            className="text-xs font-medium gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Simulate 1 Applicant
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchSimulate}
            isLoading={isBatchSimulating}
            className="text-xs font-medium gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            Stream 5 Applicants
          </Button>

          <Link to="/recruiter/jobs/create">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Postings
            </span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats?.totalJobs ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Company requisitions</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Postings
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{stats?.activeJobs ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Accepting candidates</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-blue-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applications
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <span>{stats?.totalApplications ?? 0}</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
              Live
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total candidates received</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Employer Trust Tier
            </span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800">Gold Tier (96)</div>
          <div className="text-[11px] text-slate-400 mt-1">Corporate domain verified</div>
        </div>
      </div>

      {/* Recent Applications across all recruiter jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span>Recent Candidate Applications</span>
            <span className="text-xs font-normal text-slate-500">
              (Auto-syncs in real-time)
            </span>
          </h2>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
          >
            View all jobs & pipelines
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : !stats || stats.recentApplications.length === 0 ? (
          <EmptyState
            title="No applications received yet"
            description="Create job opportunities or simulate an incoming applicant above."
            actionLabel="Post Your First Job"
            onAction={() => (window.location.href = "/recruiter/jobs/create")}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
            <AnimatePresence initial={false}>
              {stats.recentApplications.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {app.applicantName}
                      </h3>
                      <StatusBadge status={app.status} size="sm" />

                      {/* Phase 5 Vector Match pill */}
                      {app.matchScore && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          {app.matchScore}% Match
                        </span>
                      )}

                      {/* Phase 6 ATS Sync pill */}
                      {app.atsSync && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          <Layers className="w-3 h-3 text-purple-600" />
                          {app.atsSync.atsProvider}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{app.jobTitle}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{app.applicantEmail}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(app.appliedDate)}
                      </span>
                    </div>
                  </div>

                  <Link to={`/recruiter/jobs/${app.jobId}/applications`}>
                    <Button variant="outline" size="sm" className="text-xs font-semibold">
                      Review Pipeline
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
