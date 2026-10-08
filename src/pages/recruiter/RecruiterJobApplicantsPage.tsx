import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { recruiterApi } from "../../lib/api/recruiter";
import { Job, Application, ApplicationStatus, AtsProviderName } from "../../types";
import { formatDate } from "../../lib/utils";
import { StatusBadge } from "../../components/ui/status-badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import { AtsConnectorService } from "../../lib/integrations/atsConnector";
import { useRealtime } from "../../context/RealtimeContext";
import { toast } from "../../components/ui/toaster";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
  Zap,
  Radio,
  ChevronDown,
  Sparkles,
  Layers,
  Send,
  Search,
  Filter,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Selected",
  "Rejected",
];

export const RecruiterJobApplicantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, broadcastStatusUpdated, simulateIncomingApplication } = useRealtime();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [syncingAtsId, setSyncingAtsId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isBatchSimulating, setIsBatchSimulating] = useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [jobData, appsData] = await Promise.all([
        recruiterApi.getJobById(id),
        recruiterApi.getJobApplications(id),
      ]);
      setJob(jobData);
      setApplications(appsData);
    } catch {
      toast.error("Failed to load applicants for this job");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen to real-time events for this job
  useEffect(() => {
    if (events.length > 0 && id) {
      const latest = events[0];
      if (latest.jobId === id && latest.type === "application_submitted") {
        setRecentlyAddedId(latest.applicationId);
        fetchData();

        const timer = setTimeout(() => {
          setRecentlyAddedId(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [events, id, fetchData]);

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus) => {
    setUpdatingId(app.id);
    try {
      await recruiterApi.updateApplicationStatus(app.id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
      );
      broadcastStatusUpdated(app, newStatus);
      toast.success(`Application status updated to "${newStatus}" and broadcast in real-time`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSimulateApplicant = async () => {
    if (!id) return;
    setIsSimulating(true);
    try {
      const newApp = await simulateIncomingApplication(id);
      setRecentlyAddedId(newApp.id);
      await fetchData();
      toast.success(`Live candidate application received from ${newApp.applicantName}!`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleBatchSimulateApplicants = async () => {
    if (!id) return;
    setIsBatchSimulating(true);
    try {
      toast.info("Generating a batch burst of 5 live candidate applications...");
      for (let i = 0; i < 5; i++) {
        await simulateIncomingApplication(id);
        await new Promise((r) => setTimeout(r, 200));
      }
      await fetchData();
      toast.success("Successfully streamed 5 live applicant submissions with ATS webhooks!");
    } finally {
      setIsBatchSimulating(false);
    }
  };

  const handleSyncToAts = async (app: Application, provider: AtsProviderName = "Greenhouse") => {
    setSyncingAtsId(app.id);
    try {
      const syncInfo = await AtsConnectorService.syncApplication(app, provider);
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, atsSync: syncInfo } : a))
      );
      toast.success(`Synced ${app.applicantName} to ${provider} ATS (${syncInfo.candidateAtsId})!`);
    } catch (e: any) {
      toast.error("Failed to sync application to ATS");
    } finally {
      setSyncingAtsId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.matchedSkills && app.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to my jobs
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Real-Time Applicant Pipeline · Requisition Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {job ? job.title : "Candidate Applications"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {job ? `${job.company} · ${job.location} · ${applications.length} Candidates Logged` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Single Applicant Simulation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateApplicant}
            isLoading={isSimulating}
            className="text-xs font-medium gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Simulate 1 Applicant
          </Button>

          {/* Vast Applications Batch Generation */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleBatchSimulateApplicants}
            isLoading={isBatchSimulating}
            className="text-xs font-medium gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Batch Stream 5 Applicants
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Stage:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages ({applications.length})</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st} ({applications.filter((a) => a.status === st).length})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name or skill..."
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
          title={statusFilter === "all" ? "No candidates found" : `No candidates in '${statusFilter}' stage`}
          description="Click 'Batch Stream 5 Applicants' above to populate this requisition pipeline."
          actionLabel="Stream 5 Live Applicants"
          onAction={handleBatchSimulateApplicants}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          <AnimatePresence initial={false}>
            {filteredApplications.map((app) => {
              const isNewlyAdded = recentlyAddedId === app.id;

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.99 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    backgroundColor: isNewlyAdded
                      ? "rgba(240, 253, 244, 0.9)"
                      : "rgba(255, 255, 255, 1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors relative"
                >
                  {isNewlyAdded && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full animate-bounce">
                      <Radio className="w-2.5 h-2.5" />
                      NEW LIVE SUBMISSION
                    </div>
                  )}

                  <div className="space-y-2.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">
                        {app.applicantName}
                      </h3>
                      <StatusBadge status={app.status} size="sm" />

                      {/* Phase 5 Vector Match Score */}
                      {app.matchScore && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          {app.matchScore}% Vector Match
                        </span>
                      )}

                      {/* Phase 6 ATS Sync Tag */}
                      {app.atsSync ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          <Layers className="w-3 h-3 text-purple-600" />
                          {app.atsSync.atsProvider}: {app.atsSync.candidateAtsId}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSyncToAts(app, "Greenhouse")}
                          disabled={syncingAtsId === app.id}
                          className="text-[11px] font-medium text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          Push to ATS
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <a
                        href={`mailto:${app.applicantEmail}`}
                        className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {app.applicantEmail}
                      </a>

                      {app.applicantPhone && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {app.applicantPhone}
                          </span>
                        </>
                      )}

                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied {formatDate(app.appliedDate)}
                      </span>
                    </div>

                    {/* Matched Skills list */}
                    {app.matchedSkills && app.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                          Skills:
                        </span>
                        {app.matchedSkills.slice(0, 6).map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.notes && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-700 mt-1">
                        <span className="font-semibold text-slate-900">Cover Pitch: </span>
                        {app.notes}
                      </div>
                    )}
                  </div>

                  {/* Stage Control & ATS Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Stage:</span>
                      <div className="relative inline-block">
                        <select
                          value={app.status}
                          disabled={updatingId === app.id}
                          onChange={(e) =>
                            handleStatusChange(app, e.target.value as ApplicationStatus)
                          }
                          className="appearance-none text-xs font-semibold bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                      </div>
                    </div>

                    {/* Re-push to ATS webhook */}
                    {app.atsSync && (
                      <button
                        onClick={() => handleSyncToAts(app, app.atsSync!.atsProvider)}
                        disabled={syncingAtsId === app.id}
                        className="text-[11px] font-medium text-slate-500 hover:text-purple-700 transition-colors flex items-center gap-1 cursor-pointer self-end"
                        title="Re-deliver webhook payload to ATS endpoint"
                      >
                        <Send className="w-2.5 h-2.5" />
                        Re-sync webhook
                      </button>
                    )}
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
