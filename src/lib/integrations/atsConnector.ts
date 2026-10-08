import { Application, AtsProviderName, AtsSyncInfo } from "../../types/application";
import { MockStore } from "../api/mockData";

export interface AtsIntegrationStatus {
  provider: AtsProviderName;
  isConnected: boolean;
  apiKeyMasked: string;
  webhookUrl: string;
  lastWebhookDeliveredAt?: string;
  totalCandidatesSynced: number;
  syncSuccessRate: number; // e.g. 99.4%
}

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  provider: AtsProviderName;
  event: "candidate.application.created" | "candidate.stage.updated";
  candidateName: string;
  jobTitle: string;
  payloadPreview: string;
  status: "delivered_200" | "retry" | "failed";
}

const ATS_STATUS_STORAGE_KEY = "jobtrust_ats_integrations_v1";
const WEBHOOK_LOG_STORAGE_KEY = "jobtrust_webhook_logs_v1";

const INITIAL_ATS_STATUS: AtsIntegrationStatus[] = [
  {
    provider: "Greenhouse",
    isConnected: true,
    apiKeyMasked: "gh_live_••••••••9841",
    webhookUrl: "https://harvest.greenhouse.io/v1/candidates/sync",
    lastWebhookDeliveredAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    totalCandidatesSynced: 42,
    syncSuccessRate: 99.8,
  },
  {
    provider: "Lever",
    isConnected: true,
    apiKeyMasked: "lev_prod_••••••••2170",
    webhookUrl: "https://api.lever.co/v1/opportunities/webhook",
    lastWebhookDeliveredAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    totalCandidatesSynced: 28,
    syncSuccessRate: 99.2,
  },
  {
    provider: "Workday",
    isConnected: false,
    apiKeyMasked: "wd_oauth_••••••••4199",
    webhookUrl: "https://wd5-impl-services1.workday.com/ccx/service/recruiting",
    totalCandidatesSynced: 0,
    syncSuccessRate: 100,
  },
];

export class AtsConnectorService {
  public static getIntegrations(): AtsIntegrationStatus[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(ATS_STATUS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return INITIAL_ATS_STATUS;
  }

  public static saveIntegrations(integrations: AtsIntegrationStatus[]): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(ATS_STATUS_STORAGE_KEY, JSON.stringify(integrations));
      }
    } catch (e) {
      console.warn("Could not save ATS integrations", e);
    }
  }

  public static getWebhookLogs(): WebhookLogEntry[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(WEBHOOK_LOG_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return [
      {
        id: "wh-log-101",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        provider: "Greenhouse",
        event: "candidate.application.created",
        candidateName: "Alex Mercer",
        jobTitle: "Senior Full Stack Engineer",
        payloadPreview: '{"candidate_id": "GH-CAND-9182", "requisition": "job-101", "stage": "Application Review"}',
        status: "delivered_200",
      },
      {
        id: "wh-log-102",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        provider: "Lever",
        event: "candidate.stage.updated",
        candidateName: "Elena Rostova",
        jobTitle: "Lead Product Designer",
        payloadPreview: '{"opportunity_id": "LEV-OPP-3819", "new_stage": "Shortlisted"}',
        status: "delivered_200",
      },
    ];
  }

  public static addWebhookLog(entry: WebhookLogEntry): void {
    try {
      const logs = [entry, ...this.getWebhookLogs().slice(0, 24)];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(WEBHOOK_LOG_STORAGE_KEY, JSON.stringify(logs));
      }
    } catch (e) {
      console.warn("Could not save webhook log", e);
    }
  }

  /**
   * Syncs an application with external ATS (Greenhouse, Lever, or Workday)
   */
  public static async syncApplication(
    app: Application,
    provider: AtsProviderName = "Greenhouse"
  ): Promise<AtsSyncInfo> {
    const candidateAtsId = `${provider.slice(0, 2).toUpperCase()}-APP-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const syncInfo: AtsSyncInfo = {
      status: "synced",
      atsProvider: provider,
      candidateAtsId,
      syncedAt: now,
      webhookDelivered: true,
      atsRequisitionCode: `REQ-${app.jobId.slice(-4).toUpperCase()}`,
    };

    // Update application in MockStore
    const applications = MockStore.getApplications();
    const idx = applications.findIndex((a) => a.id === app.id);
    if (idx !== -1) {
      applications[idx] = {
        ...applications[idx],
        atsSync: syncInfo,
      };
      MockStore.saveApplications(applications);
    }

    // Add webhook log entry
    this.addWebhookLog({
      id: `wh-${Date.now()}`,
      timestamp: now,
      provider,
      event: "candidate.application.created",
      candidateName: app.applicantName,
      jobTitle: app.jobTitle,
      payloadPreview: JSON.stringify({
        ats_candidate_id: candidateAtsId,
        job_id: app.jobId,
        applicant: app.applicantName,
        email: app.applicantEmail,
        status: app.status,
      }),
      status: "delivered_200",
    });

    return syncInfo;
  }
}
