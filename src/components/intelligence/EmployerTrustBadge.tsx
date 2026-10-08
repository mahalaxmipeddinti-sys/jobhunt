import React, { useState } from "react";
import { EmployerTrustMetrics, EmployerTrustTier } from "../../types/normalizedJob";
import { EmployerTrustEngine } from "../../lib/intelligence/employerTrustEngine";
import { EmployerTrustModal } from "./EmployerTrustModal";
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface EmployerTrustBadgeProps {
  metrics?: EmployerTrustMetrics;
  companyName?: string;
  source?: string;
  className?: string;
  size?: "sm" | "md";
}

export const EmployerTrustBadge: React.FC<EmployerTrustBadgeProps> = ({
  metrics: propMetrics,
  companyName,
  source,
  className,
  size = "sm",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const metrics =
    propMetrics ||
    EmployerTrustEngine.evaluateEmployer({
      company_name: companyName,
      source: source || "Direct Requisition",
    });

  const getTierDisplay = (tier: EmployerTrustTier) => {
    switch (tier) {
      case "GOLD":
        return {
          label: "Gold Tier",
          sub: `${metrics.trustScore}/100`,
          bg: "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/80",
          icon: <Award className="w-3 h-3 text-amber-600" />,
        };
      case "SILVER":
        return {
          label: "Verified Gazette",
          sub: `${metrics.trustScore}/100`,
          bg: "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200/80",
          icon: <ShieldCheck className="w-3 h-3 text-blue-600" />,
        };
      case "BRONZE":
        return {
          label: "Verified Partner",
          sub: `${metrics.trustScore}/100`,
          bg: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100/80",
          icon: <CheckCircle2 className="w-3 h-3 text-orange-600" />,
        };
      default:
        return {
          label: "Trust Score",
          sub: `${metrics.trustScore}/100`,
          bg: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70",
          icon: <ShieldCheck className="w-3 h-3 text-slate-500" />,
        };
    }
  };

  const display = getTierDisplay(metrics.tier);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsModalOpen(true);
        }}
        title="Employer Trust Score & Verification Engine. Click to view employer verification dossier."
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border font-semibold transition-all cursor-pointer select-none shadow-2xs",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
          display.bg,
          className
        )}
      >
        {display.icon}
        <span>{display.label}</span>
        <span className="font-bold opacity-80">({display.sub})</span>
      </button>

      <EmployerTrustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metrics={metrics}
        companyName={companyName || "Employer"}
        source={source}
      />
    </>
  );
};
