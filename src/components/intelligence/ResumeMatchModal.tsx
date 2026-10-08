import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  ResumeVectorMatcher,
  MatchAnalysisResult,
  CandidateResumeProfile,
} from "../../lib/intelligence/resumeVectorMatcher";
import { NormalizedJob } from "../../types/normalizedJob";
import { toast } from "../ui/toaster";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  GraduationCap,
  Plus,
  X,
  RotateCcw,
} from "lucide-react";

interface ResumeMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Partial<NormalizedJob>;
  matchResult: MatchAnalysisResult;
  onMatchUpdated?: (result: MatchAnalysisResult) => void;
}

export const ResumeMatchModal: React.FC<ResumeMatchModalProps> = ({
  isOpen,
  onClose,
  job,
  matchResult: initialResult,
  onMatchUpdated,
}) => {
  const [candidateProfile, setCandidateProfile] = useState<CandidateResumeProfile>(() =>
    ResumeVectorMatcher.getCandidateResume()
  );
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult>(initialResult);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    if (candidateProfile.skills.includes(skill)) return;

    const updatedProfile: CandidateResumeProfile = {
      ...candidateProfile,
      skills: [...candidateProfile.skills, skill],
    };
    setCandidateProfile(updatedProfile);
    ResumeVectorMatcher.saveCandidateResume(updatedProfile);
    const newMatch = ResumeVectorMatcher.calculateMatch(job, updatedProfile);
    setMatchResult(newMatch);
    if (onMatchUpdated) onMatchUpdated(newMatch);
    setNewSkillInput("");
    toast.success(`Skill "${skill}" added. Vectors recalculated: ${newMatch.overallScore}% Match.`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedProfile: CandidateResumeProfile = {
      ...candidateProfile,
      skills: candidateProfile.skills.filter((s) => s !== skillToRemove),
    };
    setCandidateProfile(updatedProfile);
    ResumeVectorMatcher.saveCandidateResume(updatedProfile);
    const newMatch = ResumeVectorMatcher.calculateMatch(job, updatedProfile);
    setMatchResult(newMatch);
    if (onMatchUpdated) onMatchUpdated(newMatch);
  };

  const handleBridgeMissingSkill = (skill: string) => {
    if (candidateProfile.skills.includes(skill)) return;
    const updatedProfile: CandidateResumeProfile = {
      ...candidateProfile,
      skills: [...candidateProfile.skills, skill],
    };
    setCandidateProfile(updatedProfile);
    ResumeVectorMatcher.saveCandidateResume(updatedProfile);
    const newMatch = ResumeVectorMatcher.calculateMatch(job, updatedProfile);
    setMatchResult(newMatch);
    if (onMatchUpdated) onMatchUpdated(newMatch);
    toast.success(`Added "${skill}" to your candidate profile!`);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Phase 5: Resume Embeddings & Vector Semantic Match"
      description={`Semantic compatibility analysis for ${job.title || "Opportunity"}`}
    >
      <div className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {/* Score Card */}
        <div className="rounded-xl border border-blue-200 bg-linear-to-r from-blue-50/70 to-indigo-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Vector Semantic Alignment</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {matchResult.overallScore}%
              </span>
              <span className="text-sm font-semibold text-slate-600">Overall Match</span>
            </div>
            <p className="text-xs text-slate-600">
              Embedding cosine similarity calculated against candidate resume tokens and requisition requirements.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Skill Match:</span>
              <span className="font-bold text-slate-800">{matchResult.skillMatchScore}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Seniority Alignment:</span>
              <span className="font-bold text-slate-800">{matchResult.experienceMatchScore}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Role Fit:</span>
              <span className="font-bold text-slate-800">{matchResult.roleMatchScore}%</span>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Direct Matched Skills ({matchResult.matchedSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchResult.matchedSkills.length > 0 ? (
                matchResult.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No direct skill matches detected.</span>
              )}
            </div>
          </div>

          {matchResult.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Missing or Skill Gaps to Bridge ({matchResult.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleBridgeMissingSkill(skill)}
                    title="Click to add this skill to your candidate resume profile"
                    className="group inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <span>+ {skill}</span>
                    <span className="text-[10px] text-amber-600 opacity-0 group-hover:opacity-100">
                      (Add to resume)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations & Strengths */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2 text-xs">
          <div className="font-semibold text-slate-900">AI Match Insights:</div>
          <div className="space-y-1">
            {matchResult.strengths.map((str, idx) => (
              <div key={idx} className="text-slate-700 flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{str}</span>
              </div>
            ))}
            {matchResult.recommendations.map((rec, idx) => (
              <div key={idx} className="text-slate-700 flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">ℹ</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Profile Embeddings Editor */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Candidate Resume: {candidateProfile.fullName} ({candidateProfile.yearsOfExperience} yrs exp)
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs"
            >
              {isEditing ? "Close Editor" : "Edit Skills"}
            </Button>
          </div>

          {isEditing && (
            <div className="p-3 bg-slate-100/80 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="e.g. Kubernetes, Python, Microservices..."
                  className="text-xs py-1.5"
                />
                <Button variant="primary" size="sm" onClick={handleAddSkill}>
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {candidateProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-white border border-slate-300 text-slate-700"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
