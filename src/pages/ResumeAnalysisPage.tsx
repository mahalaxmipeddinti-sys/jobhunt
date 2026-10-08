import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobsApi } from "../lib/api/jobs";
import { NormalizedJob } from "../types/normalizedJob";
import {
  ResumeVectorMatcher,
  MatchAnalysisResult,
  CandidateResumeProfile,
} from "../lib/intelligence/resumeVectorMatcher";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { ErrorState } from "../components/common/ErrorState";
import { toast } from "../components/ui/toaster";
import {
  Sparkles,
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  Briefcase,
  Copy,
} from "lucide-react";

export const ResumeAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<NormalizedJob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeProfile, setResumeProfile] = useState<CandidateResumeProfile>(() =>
    ResumeVectorMatcher.getCandidateResume()
  );
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchJobData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await jobsApi.getJobById(id);
        if (!mounted) return;
        setJob(data);

        const currentProfile = ResumeVectorMatcher.getCandidateResume();
        setResumeProfile(currentProfile);
        const analysis = ResumeVectorMatcher.calculateMatch(data, currentProfile);
        setMatchResult(analysis);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || "Failed to load job requisition details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchJobData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleCopyPitch = () => {
    if (!job || !matchResult) return;
    const pitch = `Hello Hiring Team at ${job.company_name},\n\nI am writing to express my strong enthusiasm for the ${job.title} opportunity. With ${resumeProfile.yearsOfExperience}+ years in software engineering and direct mastery in ${matchResult.matchedSkills.slice(0, 4).join(", ")}, my background aligns strongly with your technical stack.\n\nI look forward to discussing how my experience can deliver immediate impact on your initiatives.\n\nBest regards,\n${resumeProfile.fullName}`;
    navigator.clipboard.writeText(pitch);
    setCopiedPitch(true);
    toast.success("AI-tailored cover pitch copied to clipboard!");
    setTimeout(() => setCopiedPitch(false), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorState
          title="Requisition Not Found"
          message={error || "Could not load the specified job opportunity."}
          retryLabel="Back to Jobs Board"
          onRetry={() => navigate("/jobs")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation Breadcrumb */}
      <Link
        to={`/jobs/${job.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {job.title} Requisition
      </Link>

      {/* Hero Header */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span>Vector Semantic Alignment Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Resume Match for {job.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{job.company_name}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{job.location}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to={`/jobs/${job.id}`}>
              <Button variant="primary" size="md" className="font-semibold shadow-xs">
                Apply Directly
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Match Scores Overview */}
      {matchResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Overall Vector Match</span>
            <div className="text-3xl font-extrabold text-blue-600">
              {matchResult.overallScore}%
            </div>
            <p className="text-xs text-slate-500">
              Combined skills, role title, and experience embedding proximity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Skills Overlap</span>
            <div className="text-3xl font-extrabold text-emerald-600">
              {matchResult.matchedSkills.length} Verified
            </div>
            <p className="text-xs text-slate-500">
              Direct keyword and conceptual overlap with requisition.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">Seniority Alignment</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {matchResult.experienceAlignment}
            </div>
            <p className="text-xs text-slate-500">
              Candidate profile: {resumeProfile.yearsOfExperience} years professional experience.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Analysis Breakdown */}
      {matchResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matched Skills */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Matching Competencies ({matchResult.matchedSkills.length})
            </h3>
            <p className="text-xs text-slate-500">
              These competencies on your verified profile align with the employer’s requirements:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {matchResult.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Bridgeable Competency Gaps ({matchResult.missingSkills.length})
            </h3>
            <p className="text-xs text-slate-500">
              Adding or highlighting these areas in your interview pitch will strengthen your application:
            </p>
            {matchResult.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {matchResult.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs font-medium text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                Full skill coverage! All highlighted requisition competencies are verified on your profile.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Tailored Cover Pitch Generator */}
      <div className="bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-white rounded-xl border border-blue-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600" />
              Personalized Application Pitch
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Optimized based on your verified skills and this requisition’s responsibilities.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPitch}
            className="text-xs font-semibold gap-1.5 self-start sm:self-center"
          >
            {copiedPitch ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Pitch
              </>
            )}
          </Button>
        </div>

        <div className="bg-white/90 p-5 rounded-lg border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
          {`Hello Hiring Team at ${job.company_name},\n\nI am writing to express my strong enthusiasm for the ${job.title} opportunity. With ${resumeProfile.yearsOfExperience}+ years in software engineering and direct mastery in ${matchResult?.matchedSkills.slice(0, 4).join(", ") || "core web technologies"}, my background aligns strongly with your technical stack.\n\nI look forward to discussing how my experience can deliver immediate impact on your initiatives.\n\nBest regards,\n${resumeProfile.fullName}`}
        </div>
      </div>
    </div>
  );
};
