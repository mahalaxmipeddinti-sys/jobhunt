import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { JobCard } from "../components/jobs/JobCard";
import { jobsApi } from "../lib/api/jobs";
import { Job } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Building2,
  Sparkles,
  Award,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    jobsApi
      .getJobs()
      .then((jobs) => {
        if (mounted) {
          setFeaturedJobs(jobs.slice(0, 4));
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-md shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>JobTrust AI Platform · Real-Time Discovery Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            Don't Just Find a Job. <br className="hidden sm:inline" />
            <span className="text-blue-600">Find a Job That's Actually Hiring.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            JobTrust AI is designed to help candidates discover relevant, trustworthy, and current job opportunities while eliminating ghost listings, duplicate postings, and obsolete openings.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/jobs">
              <Button size="lg" className="w-full sm:w-auto px-8 gap-2 text-base font-semibold shadow-md">
                Find Jobs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/register?role=recruiter">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 text-base font-semibold">
                I'm Hiring
              </Button>
            </Link>
          </div>

          {/* Quick stats / reassurance */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Direct Employer Sourced</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">Zero</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Scraped Ghost Postings</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-slate-900">&lt; 24h</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Status Audit Baseline</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Engineered for Job Market Integrity
          </h2>
          <p className="text-sm text-slate-600">
            Modern hiring is broken by inactive requisitions and endless applicant voids. We are building the architecture to restore trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Freshness Verification</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every job listing has a verified timeline. No dormant postings that have been abandoned by hiring teams.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Direct Recruiter Feedback</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent pipeline states: Applied, Under Review, Shortlisted, Selected, and Closed — with clear notifications.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Structured Quality Standards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standardized compensation ranges, clear experience requirements, and direct application channels.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Active Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Directly posted by verified teams actively screening applicants this week.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5 self-start">
              Browse All Jobs
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />
            <div className="h-44 bg-white rounded-xl border border-slate-200 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Recruiter / Candidate Split CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
            Start Your Search Or Post Roles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to experience honest hiring?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Whether you are an engineer seeking your next career milestone or a talent lead looking for motivated talent, JobTrust AI provides the clarity and responsiveness you need.
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <Link to="/jobs">
              <Button size="md" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-xs">
                Browse Open Roles
              </Button>
            </Link>
            <Link to="/register?role=recruiter">
              <Button variant="outline" size="md" className="bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:text-white">
                Register as Recruiter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
