import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { candidateApi } from "../lib/api/candidate";
import { recruiterApi } from "../lib/api/recruiter";
import { CandidateProfile, RecruiterProfile } from "../types";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "../components/ui/toaster";
import { User, Building, ShieldCheck } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user, role, refreshUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Candidate fields
  const [candData, setCandData] = useState<CandidateProfile>({
    id: "",
    userId: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    experience: "",
  });

  // Recruiter fields
  const [recData, setRecData] = useState<RecruiterProfile>({
    id: "",
    userId: "",
    name: "",
    email: "",
    companyName: "",
    companyDescription: "",
    companyLocation: "",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (role === "candidate") {
      candidateApi
        .getProfile()
        .then((p) => {
          if (mounted) {
            setCandData(p);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    } else if (role === "recruiter") {
      recruiterApi
        .getProfile()
        .then((p) => {
          if (mounted) {
            setRecData(p);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [role, user]);

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await candidateApi.updateProfile(candData);
      await refreshUser();
      toast.success("Candidate profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await recruiterApi.updateProfile(recData);
      await refreshUser();
      toast.success("Recruiter profile and company details saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="p-8 bg-white rounded-xl border border-slate-200 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {role === "recruiter" ? "Recruiter & Organization Profile" : "Candidate Profile"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {role === "recruiter"
            ? "Manage your company information and recruiter identity displayed on job postings."
            : "Keep your contact info and background current for direct recruiter reviews."}
        </p>
      </div>

      {role === "candidate" ? (
        <form onSubmit={handleCandidateSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={candData.name}
                onChange={(e) => setCandData({ ...candData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={candData.email}
                disabled
                helperText="Primary account email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={candData.phone || ""}
                onChange={(e) => setCandData({ ...candData, phone: e.target.value })}
              />
              <Input
                label="Location"
                placeholder="e.g. San Francisco, CA"
                value={candData.location || ""}
                onChange={(e) => setCandData({ ...candData, location: e.target.value })}
              />
            </div>

            <Textarea
              label="Bio / Professional Summary"
              placeholder="Brief summary of your expertise, domain focus, and career goals..."
              rows={3}
              value={candData.bio || ""}
              onChange={(e) => setCandData({ ...candData, bio: e.target.value })}
            />

            <Textarea
              label="Experience Summary"
              placeholder="e.g. 5 years building frontend architectures with React, TypeScript, and Tailwind..."
              rows={3}
              value={candData.experience || ""}
              onChange={(e) => setCandData({ ...candData, experience: e.target.value })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecruiterSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Building className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Recruiter & Company Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recruiter Name"
                value={recData.name}
                onChange={(e) => setRecData({ ...recData, name: e.target.value })}
                required
              />
              <Input
                label="Work Email"
                type="email"
                value={recData.email}
                disabled
                helperText="Primary account email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Acme Cloud Infrastructure"
                value={recData.companyName}
                onChange={(e) => setRecData({ ...recData, companyName: e.target.value })}
                required
              />
              <Input
                label="Company Headquarters / Location"
                placeholder="e.g. San Francisco, CA"
                value={recData.companyLocation || ""}
                onChange={(e) => setRecData({ ...recData, companyLocation: e.target.value })}
              />
            </div>

            <Textarea
              label="Company Description"
              placeholder="What does your company do? What is your mission, engineering stack, or culture?"
              rows={4}
              value={recData.companyDescription || ""}
              onChange={(e) => setRecData({ ...recData, companyDescription: e.target.value })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
