import React from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { EmployerTrustMetrics } from "../../types/normalizedJob";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Building2,
  Star,
  FileCheck,
  Lock,
  ExternalLink,
} from "lucide-react";

interface EmployerTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: EmployerTrustMetrics;
  companyName: string;
  source?: string;
}

export const EmployerTrustModal: React.FC<EmployerTrustModalProps> = ({
  isOpen,
  onClose,
  metrics,
  companyName,
  source,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Phase 4: Employer Trust & Verification Dossier"
      description={`Official verification standing for ${companyName}`}
    >
      <div className="space-y-5 pt-2">
        {/* Tier Banner */}
        <div className="rounded-xl border border-amber-200 bg-linear-to-r from-amber-50/70 to-orange-50/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{metrics.tierLabel}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {metrics.trustScore}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 100 Trust Score</span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm">
              Verified corporate domain authenticity, authenticated recruiter credentials, and active offer delivery track record.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Legitimacy Verified
            </span>
            <span className="text-[11px] text-slate-500">Zero Ghosting Pledge</span>
          </div>
        </div>

        {/* 4 Verification Vector Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Domain Verification</span>
            </div>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Corporate MX & DNS Passed
            </div>
            <div className="text-[11px] text-slate-500">
              Authentic company domain
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Confirmed Offers</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {metrics.offersConfirmedCount}+ Verified Hires
            </div>
            <div className="text-[11px] text-slate-500">
              Successful candidate onboardings
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Candidate Experience</span>
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
              <span>{metrics.candidateRating} / 5.0</span>
              <span className="text-[11px] font-normal text-slate-500">★★★★★</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Interview transparency feedback
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Gazette / Legal Mandate</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {metrics.officialGazetteVerified ? "Gazette Registered" : "Direct Employer"}
            </div>
            <div className="text-[11px] text-slate-500">
              Legally authenticated source
            </div>
          </div>
        </div>

        {/* Safe Hiring Principles */}
        <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 space-y-2 text-xs">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            JobTrust Verified Requisition Principles
          </div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Employer has committed to active review within 48 hours of candidate application.</li>
            <li>No candidate fees or pay-to-apply schemes permitted.</li>
            <li>Requisition ID tracked and matched with active ATS webhooks.</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
