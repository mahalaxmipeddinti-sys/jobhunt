import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobsApi } from "../lib/api/jobs";
import { NormalizedJob } from "../types/normalizedJob";
import { formatCurrency, formatDate } from "../lib/utils";
import { JobSourceBadge } from "../components/jobs/JobSourceBadge";
import { JobFreshness } from "../components/jobs/JobFreshness";
import { GhostJobBadge } from "../components/intelligence/GhostJobBadge";
import { EmployerTrustBadge } from "../components/intelligence/EmployerTrustBadge";
import { ResumeMatchBadge } from "../components/intelligence/ResumeMatchBadge";
import { GhostJobAuditorModal } from "../components/intelligence/GhostJobAuditorModal";
import { EmployerTrustModal } from "../components/intelligence/EmployerTrustModal";
import { ResumeMatchModal } from "../components/intelligence/ResumeMatchModal";
import { GhostJobAuditor } from "../lib/intelligence/ghostJobAuditor";
import { EmployerTrustEngine } from "../lib/intelligence/employerTrustEngine";
import { ResumeVectorMatcher, MatchAnalysisResult } from "../lib/intelligence/resumeVectorMatcher";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Dialog } from "../components/ui/dialog";
import { Skeleton } from "../components/ui/skeleton";
import { ErrorState } from "../components/common/ErrorState";
import { useAuth } from "../context/AuthContext";
import { useRealtime } from "../context/RealtimeContext";
import { toast } from "../components/ui/toaster";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  Award,
  ExternalLink,
  Tag,
  Sparkles,
} from "lucide-react";

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const { broadcastApplicationSubmitted } = useRealtime();

  const [job, setJob] = useState<NormalizedJob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Application state
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [coverNote, setCoverNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [applySuccess, setApplySuccess] = useState<boolean>(false);

  // Intelligence Modals state
  const [isGhostAuditModalOpen, setIsGhostAuditModalOpen] = useState<boolean>(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      jobsApi.getJobById(id),
      user && user.role === "candidate"
        ? jobsApi.hasApplied(id, user.id)
        : Promise.resolve(false),
    ])
      .then(([jobData, appliedStatus]) => {
        if (mounted) {
          // Enrich with intelligence if missing
          jobData.ghost_audit = jobData.ghost_audit || GhostJobAuditor.auditJob(jobData);
          jobData.employer_trust = jobData.employer_trust || EmployerTrustEngine.evaluateEmployer(jobData);
          const computedMatch = ResumeVectorMatcher.calculateMatch(jobData);
          jobData.match_score = computedMatch.overallScore;
          setMatchResult(computedMatch);

          setJob(jobData);
          setHasApplied(appliedStatus);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load job details");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id, user]);

  const handleOpenApply = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to apply");
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (role === "recruiter") {
      toast.error("Recruiter accounts cannot submit candidate applications");
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const newApp = await jobsApi.applyToJob(id, coverNote);
      broadcastApplicationSubmitted(newApp);
      setHasApplied(true);
      setApplySuccess(true);
      setIsApplyModalOpen(false);
      toast.success("Application submitted successfully and synced across real-time pipelines!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        <Skeleton className="h-6 w-32" />
        <div className="p-8 bg-white rounded-xl border border-slate-200/80 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Could not find this job posting"
          message={error || "This job may have been closed or is no longer accessible."}
          onRetry={() => navigate("/jobs")}
          retryLabel="Back to All Jobs"
        />
      </div>
    );
  }

  const salaryDisplay =
    job.salary_min && job.salary_max
      ? `${job.salary_currency === "INR" ? "₹" : "$"}${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`
      : job.salary_min
      ? `From ${job.salary_currency === "INR" ? "₹" : "$"}${job.salary_min.toLocaleString()}`
      : "Competitive compensation aligned with role seniority";

  const ghostSignals = job.ghost_audit || GhostJobAuditor.auditJob(job);
  const trustMetrics = job.employer_trust || EmployerTrustEngine.evaluateEmployer(job);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all opportunities
      </Link>

      {/* Main Header Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <JobSourceBadge source={job.source} />
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {job.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{job.company_name}</span>
            </div>

            {/* Intelligence Badges Bar in Header */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <EmployerTrustBadge
                companyName={job.company_name}
                source={job.source}
                metrics={trustMetrics}
                size="md"
              />
              <GhostJobBadge
                signals={ghostSignals}
                jobTitle={job.title}
                companyName={job.company_name}
                source={job.source}
                postedAt={job.posted_at}
                size="md"
              />
              <ResumeMatchBadge job={job} size="md" />
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <Link to={`/jobs/${job.id}/resume-analysis`}>
              <Button
                variant="outline"
                size="md"
                className="px-4 font-semibold text-blue-700 border-blue-200 hover:bg-blue-50 gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                Optimize My Resume
              </Button>
            </Link>

            {job.source_url && job.source_url.startsWith("http") && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span>View Original Notice</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            )}

            {hasApplied || applySuccess ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleOpenApply}
                className="px-5 font-semibold"
              >
                Apply for Opportunity
              </Button>
            )}
          </div>
        </div>

        {/* Unboxed Metadata row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{job.location}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>{job.employment_type}</span>
          </div>
          {job.experience_level && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" />
                <span>{job.experience_level}</span>
              </div>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span>{salaryDisplay}</span>
          </div>
        </div>
      </div>

      {/* Grid: Job Overview & Intelligence Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">
                Requisition Details & Responsibilities
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                {job.description}
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Key Skills & Competencies
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phase 5: Semantic Resume Match Breakdown Banner */}
          {matchResult && (
            <div className="rounded-xl border border-blue-200 bg-linear-to-r from-blue-50/60 to-indigo-50/40 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Automated Resume Vector Alignment ({matchResult.overallScore}%)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Embedding match between your verified candidate profile and this requisition.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="text-xs font-semibold border-blue-300 text-blue-700 hover:bg-blue-100 self-start sm:self-center"
                >
                  Inspect Embeddings
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-blue-100">
                <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Matched Skills</span>
                  <span className="font-bold text-emerald-700">
                    {matchResult.matchedSkills.length} Verified
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Missing Skills</span>
                  <span className="font-bold text-amber-700">
                    {matchResult.missingSkills.length} Bridgeable
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Seniority Fit</span>
                  <span className="font-bold text-blue-700">
                    {matchResult.experienceAlignment}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Intelligence Cards */}
        <div className="space-y-6">
          {/* Phase 3 & 4 Verification Box */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900">
              Verification & Origin
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Aggregated From</span>
                <span className="font-semibold text-slate-800">{job.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date Published</span>
                <span className="font-medium text-slate-700">{formatDate(job.posted_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Employer Standing</span>
                <button
                  onClick={() => setIsTrustModalOpen(true)}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  {trustMetrics.tierLabel} ({trustMetrics.trustScore}/100)
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ghost-Job Risk</span>
                <button
                  onClick={() => setIsGhostAuditModalOpen(true)}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {ghostSignals.livenessStatus} ({ghostSignals.ghostRiskScore}%)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              {job.source_url && job.source_url.startsWith("http") && (
                <a
                  href={job.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span>Open Official Source Notice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {hasApplied || applySuccess ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-emerald-900">
                    Application submitted successfully.
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Track your review status in your candidate dashboard.
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleOpenApply}
                  className="w-full font-bold shadow-xs"
                >
                  Direct Application Track
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Application Modal Dialog */}
      <Dialog
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        description={`${job.company_name} · ${job.location}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <p>
              <strong>Applying as:</strong> {user?.name} ({user?.email})
            </p>
            <p className="text-[11px] text-slate-500">
              Your verified background, skills vector match ({matchResult?.overallScore || 90}%), and contact details will be dispatched directly to recruiter pipelines and enterprise ATS endpoints.
            </p>
          </div>

          <Textarea
            label="Cover note / key strengths (optional)"
            placeholder="Introduce your relevant experience and specific alignment with this requisition..."
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            rows={4}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsApplyModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmApply}
              isLoading={submitting}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modals for Phases 3, 4, 5, 6 */}
      <GhostJobAuditorModal
        isOpen={isGhostAuditModalOpen}
        onClose={() => setIsGhostAuditModalOpen(false)}
        signals={ghostSignals}
        jobTitle={job.title}
        companyName={job.company_name}
        source={job.source}
      />

      <EmployerTrustModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        metrics={trustMetrics}
        companyName={job.company_name}
        source={job.source}
      />

      {matchResult && (
        <ResumeMatchModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          job={job}
          matchResult={matchResult}
          onMatchUpdated={(updated) => setMatchResult(updated)}
        />
      )}
    </div>
  );
};
