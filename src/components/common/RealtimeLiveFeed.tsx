import React, { useState } from "react";
import { useRealtime } from "../../context/RealtimeContext";
import { formatDate } from "../../lib/utils";
import { StatusBadge } from "../ui/status-badge";
import { Button } from "../ui/button";
import {
  Bell,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export const RealtimeLiveFeedButton: React.FC = () => {
  const { events, unreadCount, isConnected, markAllAsRead, simulateIncomingApplication } =
    useRealtime();
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await simulateIncomingApplication();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        aria-label="Real-time Application Stream"
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200/90 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-800">
                Real-Time Application Feed
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Test Live Action */}
          <div className="p-3 bg-blue-50/60 border-b border-blue-100/60 flex items-center justify-between gap-2">
            <div className="text-[11px] text-blue-900 leading-tight">
              Test multi-user real-time stream:
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulate}
              isLoading={isSimulating}
              className="text-xs h-7 px-2.5 bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-3 h-3 mr-1" />
              Simulate Live Applicant
            </Button>
          </div>

          {/* Feed List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {events.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                <Radio className="w-6 h-6 mx-auto text-slate-400 stroke-[1.5]" />
                <p className="font-semibold text-slate-700">Live stream connected</p>
                <p>New applications & status updates will broadcast here in real-time.</p>
              </div>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className="p-3.5 hover:bg-slate-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 truncate">
                      {ev.candidateName}
                    </span>
                    <StatusBadge status={ev.status} size="sm" />
                  </div>
                  <p className="text-slate-600 leading-snug">
                    {ev.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{ev.company}</span>
                    <Link
                      to={`/recruiter/jobs/${ev.jobId}/applications`}
                      onClick={() => setIsOpen(false)}
                      className="text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      View pipeline <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
            <span className="text-[10px] text-slate-500">
              ⚡ Synchronized across all tabs via BroadcastChannel IPC
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
