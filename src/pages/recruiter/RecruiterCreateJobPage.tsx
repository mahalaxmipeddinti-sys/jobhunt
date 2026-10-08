import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { recruiterApi } from "../../lib/api/recruiter";
import { EmploymentType } from "../../types";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/toaster";
import { ArrowLeft, Briefcase, Building2 } from "lucide-react";

const EMPLOYMENT_OPTIONS = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

export const RecruiterCreateJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get("edit");

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(user?.companyName || "");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full Time");
  const [experience, setExperience] = useState("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [description, setDescription] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [department, setDepartment] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editJobId) {
      setLoading(true);
      recruiterApi
        .getJobById(editJobId)
        .then((job) => {
          setTitle(job.title);
          setCompany(job.company);
          setLocation(job.location);
          setEmploymentType(job.employmentType);
          setExperience(job.experience);
          setMinSalary(job.minSalary ? String(job.minSalary) : "");
          setMaxSalary(job.maxSalary ? String(job.maxSalary) : "");
          setDescription(job.description);
          setApplicationUrl(job.applicationUrl || "");
          setDepartment(job.department || "");
        })
        .catch(() => {
          toast.error("Could not load job for editing");
          navigate("/recruiter/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [editJobId, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = "Job title is required";
    if (!company.trim()) errs.company = "Company name is required";
    if (!location.trim()) errs.location = "Job location is required";
    if (!experience.trim()) errs.experience = "Experience requirement is required (e.g. '3-5 Years')";
    if (!description.trim() || description.trim().length < 30) {
      errs.description = "Please provide a comprehensive description (at least 30 characters)";
    }

    if (minSalary && isNaN(Number(minSalary))) {
      errs.minSalary = "Minimum salary must be a valid number";
    }
    if (maxSalary && isNaN(Number(maxSalary))) {
      errs.maxSalary = "Maximum salary must be a valid number";
    }
    if (minSalary && maxSalary && Number(minSalary) > Number(maxSalary)) {
      errs.maxSalary = "Maximum salary cannot be lower than minimum salary";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        company,
        location,
        employmentType,
        experience,
        minSalary: minSalary ? Number(minSalary) : undefined,
        maxSalary: maxSalary ? Number(maxSalary) : undefined,
        description,
        applicationUrl: applicationUrl || undefined,
        department: department || undefined,
      };

      if (editJobId) {
        await recruiterApi.updateJob(editJobId, payload);
        toast.success("Job posting updated successfully");
      } else {
        await recruiterApi.createJob(payload);
        toast.success("Job posting published successfully");
      }

      navigate("/recruiter/jobs");
    } catch (err: any) {
      toast.error(err.message || "Failed to save job posting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to my jobs
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {editJobId ? "Edit Job Posting" : "Create New Job Opportunity"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide structured, transparent details to ensure candidate trust and quick qualification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">Core Job Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                required
              />
            </div>

            <Input
              label="Company Name"
              placeholder="e.g. Acme Cloud Infrastructure"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              error={errors.company}
              required
            />

            <Input
              label="Department / Team"
              placeholder="e.g. Core Platform / Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g. San Francisco, CA (Hybrid) or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              required
            />

            <Select
              label="Employment Type"
              options={EMPLOYMENT_OPTIONS}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Experience Required"
              placeholder="e.g. 3-5 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              error={errors.experience}
              required
            />

            <Input
              label="Min Salary (USD/yr)"
              type="number"
              placeholder="120000"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              error={errors.minSalary}
            />

            <Input
              label="Max Salary (USD/yr)"
              type="number"
              placeholder="160000"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              error={errors.maxSalary}
            />
          </div>

          <Textarea
            label="Job Description & Responsibilities"
            placeholder="Outline role responsibilities, key projects, qualification requirements, and benefits..."
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
            helperText="Clear, transparent descriptions receive higher engagement from qualified talent."
          />

          <Input
            label="Application URL (Optional)"
            type="url"
            placeholder="https://company.com/careers/listing"
            value={applicationUrl}
            onChange={(e) => setApplicationUrl(e.target.value)}
            helperText="Optional link to your company external ATS or careers portal"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate("/recruiter/jobs")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={submitting}>
              {editJobId ? "Save Changes" : "Publish Job"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
