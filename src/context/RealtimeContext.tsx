import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus, Job } from "../types";
import { MockStore } from "../lib/api/mockData";
import { toast } from "../components/ui/toaster";

export interface RealtimeApplicationEvent {
  id: string;
  type: "application_submitted" | "status_updated" | "job_status_changed";
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  timestamp: string;
  message: string;
}

interface RealtimeContextType {
  events: RealtimeApplicationEvent[];
  unreadCount: number;
  isConnected: boolean;
  markAllAsRead: () => void;
  broadcastApplicationSubmitted: (app: Application) => void;
  broadcastStatusUpdated: (app: Application, newStatus: ApplicationStatus) => void;
  simulateIncomingApplication: (targetJobId?: string) => Promise<Application>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = "jobtrust_realtime_events_v1";

const SAMPLE_LIVE_CANDIDATES = [
  { name: "Devon Vance", email: "devon.vance@techlead.dev", note: "10+ years experience, led platform infrastructure at scale." },
  { name: "Aria Thorne", email: "aria.thorne@designsystems.io", note: "Full-stack UI architect specializing in React, TypeScript, and microfrontends." },
  { name: "Kai Takahashi", email: "kai.t@distributed.net", note: "Experienced cloud systems engineer with deep Kubernetes & Terraform background." },
  { name: "Maya Patel", email: "m.patel@datascience.org", note: "Product-minded full stack builder with high attention to user-facing latency." },
  { name: "Zane Holloway", email: "zane.h@openprotocol.com", note: "Senior engineer with multiple open-source contributions and production deployments." },
];

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<RealtimeApplicationEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel for cross-tab realtime synchronization
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data && event.data.type) {
            handleIncomingRealtimeEvent(event.data, false);
          }
        };
        setChannel(bc);
      }
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment, falling back to local bus", e);
    }

    return () => {
      bc?.close();
    };
  }, []);

  const handleIncomingRealtimeEvent = useCallback(
    (ev: RealtimeApplicationEvent, isInitiator: boolean = false) => {
      setEvents((prev) => [ev, ...prev.slice(0, 29)]);
      setUnreadCount((prev) => prev + 1);

      // Trigger user-friendly real-time toast
      if (!isInitiator) {
        if (ev.type === "application_submitted") {
          toast.info(
            `⚡ Real-Time Application Received: ${ev.candidateName} applied for ${ev.jobTitle}`,
            {
              description: `${ev.company} · Direct candidate submission`,
              duration: 5000,
            }
          );
        } else if (ev.type === "status_updated") {
          toast.success(
            `⚡ Stage Update: ${ev.candidateName} (${ev.jobTitle}) is now ${ev.status}`,
            {
              duration: 4000,
            }
          );
        }
      }
    },
    []
  );

  const broadcastApplicationSubmitted = useCallback(
    (app: Application) => {
      const event: RealtimeApplicationEvent = {
        id: `ev-${Date.now()}`,
        type: "application_submitted",
        applicationId: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        candidateName: app.applicantName,
        candidateEmail: app.applicantEmail,
        status: app.status,
        timestamp: new Date().toISOString(),
        message: `${app.applicantName} submitted an application for ${app.jobTitle}`,
      };

      handleIncomingRealtimeEvent(event, true);
      channel?.postMessage(event);
    },
    [channel, handleIncomingRealtimeEvent]
  );

  const broadcastStatusUpdated = useCallback(
    (app: Application, newStatus: ApplicationStatus) => {
      const event: RealtimeApplicationEvent = {
        id: `ev-${Date.now()}`,
        type: "status_updated",
        applicationId: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        candidateName: app.applicantName,
        candidateEmail: app.applicantEmail,
        status: newStatus,
        timestamp: new Date().toISOString(),
        message: `Application for ${app.jobTitle} updated to "${newStatus}"`,
      };

      handleIncomingRealtimeEvent(event, true);
      channel?.postMessage(event);
    },
    [channel, handleIncomingRealtimeEvent]
  );

  const simulateIncomingApplication = useCallback(
    async (targetJobId?: string): Promise<Application> => {
      const jobs = MockStore.getJobs();
      const activeJobs = jobs.filter((j) => j.status === "Active");
      const targetJob =
        (targetJobId ? jobs.find((j) => j.id === targetJobId) : null) ||
        activeJobs[Math.floor(Math.random() * activeJobs.length)] ||
        jobs[0];

      const candidateSample =
        SAMPLE_LIVE_CANDIDATES[Math.floor(Math.random() * SAMPLE_LIVE_CANDIDATES.length)];

      const newApp: Application = {
        id: `app-live-${Date.now()}`,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        company: targetJob.company,
        jobLocation: targetJob.location,
        employmentType: targetJob.employmentType,
        applicantId: `cand-sim-${Date.now()}`,
        applicantName: candidateSample.name,
        applicantEmail: candidateSample.email,
        appliedDate: new Date().toISOString(),
        status: "Applied",
        notes: candidateSample.note,
      };

      const existingApps = MockStore.getApplications();
      MockStore.saveApplications([newApp, ...existingApps]);

      // Increment applicant count on job
      targetJob.applicantCount = (targetJob.applicantCount || 0) + 1;
      MockStore.saveJobs(jobs);

      // Broadcast real-time event to all listeners
      broadcastApplicationSubmitted(newApp);

      toast.success(
        `⚡ Real-Time Applicant Arrived! ${candidateSample.name} applied for "${targetJob.title}"`,
        {
          duration: 5000,
        }
      );

      return newApp;
    },
    [broadcastApplicationSubmitted]
  );

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <RealtimeContext.Provider
      value={{
        events,
        unreadCount,
        isConnected: true,
        markAllAsRead,
        broadcastApplicationSubmitted,
        broadcastStatusUpdated,
        simulateIncomingApplication,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}
