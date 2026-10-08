import React, { useState } from "react";
import { jobsApi } from "../../lib/api/jobs";
import { SourceMonitoringStats } from "../../types/normalizedJob";
import { ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";

interface SourceStatusBannerProps {
  onRefreshCompleted?: () => void;
  className?: string;
}

export const SourceStatusBanner: React.FC<SourceStatusBannerProps> = ({
  onRefreshCompleted,
  className,
}) => {
  const [stats, setStats] = useState<SourceMonitoringStats[]>(jobsApi.getSourceStatus());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      const summary = await jobsApi.syncSources(true);
      setStats(jobsApi.getSourceStatus());
      toast.success(
        `Aggregation sync finished: ${summary.totalStored} unique jobs active across ${summary.sourcesSucceeded} sources.`
      );
      onRefreshCompleted?.();
    } catch (err: any) {
      toast.error(`Sync error: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">
            Real-Time Multi-Source Aggregator Active
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">·</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Legitimate official portals & verified permitted APIs connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            isLoading={isRefreshing}
            className="text-xs h-7 px-2.5 gap-1 border-slate-300 hover:bg-white"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Sync Live Sources</span>
          </Button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-xs flex items-center gap-0.5"
            aria-label="Toggle source health metrics"
          >
            <span>{isExpanded ? "Hide" : "Sources"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white text-xs animate-in fade-in-0 duration-150">
          {stats.map((s) => (
            <div
              key={s.sourceName}
              className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/40 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 truncate max-w-[160px]">
                  {s.sourceName}
                </span>
                {s.status === "healthy" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                Stored: <strong className="text-slate-800">{s.totalStored}</strong> verified
              </div>
              <div className="text-[10px] text-slate-400">
                Status: <span className="text-emerald-700 font-medium capitalize">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
