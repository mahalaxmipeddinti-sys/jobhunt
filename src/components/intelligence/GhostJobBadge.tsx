import React, { useState } from "react";
import { GhostAuditSignals, GhostLivenessStatus } from "../../types/normalizedJob";
import { GhostJobAuditor } from "../../lib/intelligence/ghostJobAuditor";
import { GhostJobAuditorModal } from "./GhostJobAuditorModal";
import { Ghost, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface GhostJobBadgeProps {
  signals?: GhostAuditSignals;
  jobTitle?: string;
  companyName?: string;
  source?: string;
  postedAt?: string;
  className?: string;
  size?: "sm" | "md";
}

export const GhostJobBadge: React.FC<GhostJobBadgeProps> = ({
  signals: propSignals,
  jobTitle,
  companyName,
  source,
  postedAt,
  className,
  size = "sm",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signals, setSignals] = useState<GhostAuditSignals>(
    propSignals ||
      GhostJobAuditor.auditJob({
        title: jobTitle,
        company_name: companyName,
        source: source || "Direct Requisition",
        posted_at: postedAt || new Date().toISOString(),
      })
  );

  const getStatusConfig = (status: GhostLivenessStatus) => {
    switch (status) {
      case "ACTIVELY_HIRING":
        return {
          label: "Actively Hiring",
          riskBadge: `Low Ghost Risk (${signals.ghostRiskScore}%)`,
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/70",
          dot: "bg-emerald-500",
          icon: <Sparkles className="w-3 h-3 text-emerald-600" />,
        };
      case "NORMAL_CADENCE":
        return {
          label: "Normal Cadence",
          riskBadge: `Fair Risk (${signals.ghostRiskScore}%)`,
          bg: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/70",
          dot: "bg-blue-500",
          icon: <Ghost className="w-3 h-3 text-blue-600" />,
        };
      case "STALE_WARNING":
        return {
          label: "Stale Listing",
          riskBadge: `Elevated Risk (${signals.ghostRiskScore}%)`,
          bg: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/70",
          dot: "bg-amber-500",
          icon: <AlertCircle className="w-3 h-3 text-amber-600" />,
        };
      case "SUSPECTED_GHOST":
        return {
          label: "Suspected Ghost",
          riskBadge: `High Risk (${signals.ghostRiskScore}%)`,
          bg: "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/70",
          dot: "bg-rose-500",
          icon: <ShieldAlert className="w-3 h-3 text-rose-600" />,
        };
    }
  };

  const config = getStatusConfig(signals.livenessStatus);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsModalOpen(true);
        }}
        title="Automated Requisition Liveness & Ghost-Job Audit. Click to inspect signals."
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border font-medium transition-all cursor-pointer select-none",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
          config.bg,
          className
        )}
      >
        <span className="relative flex h-1.5 w-1.5">
          {signals.livenessStatus === "ACTIVELY_HIRING" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", config.dot)} />
        </span>
        <span className="font-semibold">{config.label}</span>
        <span className="text-[10px] opacity-75">· {signals.ghostRiskScore}%</span>
      </button>

      <GhostJobAuditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        signals={signals}
        jobTitle={jobTitle || "Requisition"}
        companyName={companyName || "Organization"}
        source={source}
        onReAudit={(newSignals) => setSignals(newSignals)}
      />
    </>
  );
};
