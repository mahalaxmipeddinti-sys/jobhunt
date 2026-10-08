import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import {
  ResumeVectorMatcher,
  CandidateResumeProfile,
} from "../lib/intelligence/resumeVectorMatcher";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../components/ui/toaster";
import {
  FileText,
  Sparkles,
  Award,
  Briefcase,
  CheckCircle2,
  Plus,
  X,
  Download,
  Upload,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap,
} from "lucide-react";

export const ResumesPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateResumeProfile>(() =>
    ResumeVectorMatcher.getCandidateResume()
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>("");
  const [headline, setHeadline] = useState<string>(profile.headline);
  const [summary, setSummary] = useState<string>(profile.summary);
  const [years, setYears] = useState<number>(profile.yearsOfExperience);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [education, setEducation] = useState<string>(profile.education);

  useEffect(() => {
    const loaded = ResumeVectorMatcher.getCandidateResume();
    setProfile(loaded);
    setHeadline(loaded.headline);
    setSummary(loaded.summary);
    setYears(loaded.yearsOfExperience);
    setSkills(loaded.skills);
    setEducation(loaded.education);
  }, []);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" is already present in your skills list.`);
      return;
    }
    setSkills([...skills, trimmed]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = () => {
    const updated: CandidateResumeProfile = {
      ...profile,
      fullName: user?.name || profile.fullName,
      headline,
      summary,
      yearsOfExperience: Number(years),
      skills,
      education,
    };
    ResumeVectorMatcher.saveCandidateResume(updated);
    setProfile(updated);
    setIsEditing(false);
    toast.success("Resume vector profile updated and saved to local embedding index!");
  };

  const handleResetDefaults = () => {
    localStorage.removeItem("jobtrust_candidate_resume_v1");
    const loaded = ResumeVectorMatcher.getCandidateResume();
    setProfile(loaded);
    setHeadline(loaded.headline);
    setSummary(loaded.summary);
    setYears(loaded.yearsOfExperience);
    setSkills(loaded.skills);
    setEducation(loaded.education);
    setIsEditing(false);
    toast.info("Restored default verified resume profile.");
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Vector Match Semantic Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Resume & Skill Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your verified credentials, technical competencies, and vector embeddings for instant job matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveProfile}
                className="gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaults}
                className="text-xs text-slate-600"
              >
                Reset Default
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5"
              >
                Edit Resume Profile
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Vector Score & Quick Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified Skills</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{profile.skills.length}</div>
          <p className="text-[11px] text-slate-500">Indexed for real-time requisition matching</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Experience Level</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {profile.yearsOfExperience} <span className="text-sm font-normal text-slate-500">Years</span>
          </div>
          <p className="text-[11px] text-slate-500">Mid-to-Senior Tier verified alignment</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Target Roles</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {profile.preferredRoles.length}
          </div>
          <p className="text-[11px] text-slate-500">{profile.preferredRoles.slice(0, 2).join(", ")}</p>
        </div>
      </div>

      {/* Profile Form / View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Candidate Profile Information
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Headline
                  </label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Full Stack & Cloud Architect"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Summary
                  </label>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    placeholder="Brief overview of background, major systems built, and key technical achievements..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Years of Relevant Experience
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={40}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Highest Education / Credential
                    </label>
                    <Input
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Headline
                  </span>
                  <div className="text-base font-semibold text-slate-900">{profile.headline}</div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Summary
                  </span>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {profile.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Experience</span>
                    <span className="font-semibold text-slate-800">
                      {profile.yearsOfExperience} Years Professional Practice
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Education</span>
                    <span className="font-semibold text-slate-800">{profile.education}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Skills Management */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Technical Competencies & Skills
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These keywords are tokenized into 64-dimensional semantic vectors to calculate match scores against job postings.
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 pt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. Next.js, Go, Rust)..."
                  className="flex-1 text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  className="gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Skill
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Opportunities & Learning */}
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200 bg-linear-to-b from-blue-50/70 to-indigo-50/40 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
              <span>Instant Job Matching</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every job on JobTrust AI automatically compares against this verified profile to show your exact alignment score, matched skills, and bridgeable gaps.
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="sm" className="w-full gap-2 font-semibold">
                <span>Browse Matching Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Next Step: Bridge Skill Gaps
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accelerate your qualification for top engineering and government positions with tailored learning roadmaps.
            </p>
            <Link to="/learning">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold text-slate-700">
                Open Skill Learning Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
