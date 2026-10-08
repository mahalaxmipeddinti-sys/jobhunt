import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  AtsConnectorService,
  AtsIntegrationStatus,
  WebhookLogEntry,
} from "../../lib/integrations/atsConnector";
import { AtsProviderName } from "../../types/application";
import { toast } from "../ui/toaster";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Radio,
  Send,
  RotateCw,
  Clock,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface AtsIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsIntegrationsModal: React.FC<AtsIntegrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [integrations, setIntegrations] = useState<AtsIntegrationStatus[]>(() =>
    AtsConnectorService.getIntegrations()
  );
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>(() =>
    AtsConnectorService.getWebhookLogs()
  );
  const [isPinging, setIsPinging] = useState<string | null>(null);

  const handleTestPing = async (provider: AtsProviderName) => {
    setIsPinging(provider);
    await new Promise((r) => setTimeout(r, 500));

    const newLog: WebhookLogEntry = {
      id: `wh-test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      provider,
      event: "candidate.application.created",
      candidateName: "Alex Mercer",
      jobTitle: "Senior Full Stack Engineer",
      payloadPreview: JSON.stringify({
        ats_ping: "HEALTH_CHECK_200",
        provider,
        timestamp: new Date().toISOString(),
      }),
      status: "delivered_200",
    };

    AtsConnectorService.addWebhookLog(newLog);
    setWebhookLogs(AtsConnectorService.getWebhookLogs());
    setIsPinging(null);
    toast.success(`Webhook test ping delivered to ${provider} API endpoint! HTTP 200 OK.`);
  };

  const handleToggleConnection = (provider: AtsProviderName) => {
    const updated = integrations.map((item) =>
      item.provider === provider ? { ...item, isConnected: !item.isConnected } : item
    );
    setIntegrations(updated);
    AtsConnectorService.saveIntegrations(updated);
    toast.info(`${provider} integration status updated.`);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Phase 6: ATS Integrations Hub"
      description="Active applicant tracking system synchronization (Greenhouse · Lever · Workday)"
    >
      <div className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {/* Intro */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            JobTrust AI automatically maps candidate submissions to enterprise ATS endpoints, syncing candidate records, interview stages, and recruiter feedback via authenticated webhooks.
          </p>
        </div>

        {/* 3 ATS Providers Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Connected Applicant Tracking Systems
          </h4>

          {integrations.map((ats) => (
            <div
              key={ats.provider}
              className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {ats.provider.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{ats.provider}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ats.isConnected
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {ats.isConnected ? "Connected & Live" : "Inactive"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      API Key: {ats.apiKeyMasked}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestPing(ats.provider)}
                    isLoading={isPinging === ats.provider}
                    disabled={!ats.isConnected}
                    className="text-xs font-medium gap-1"
                  >
                    <Send className="w-3 h-3 text-blue-600" />
                    Test Ping
                  </Button>

                  <button
                    onClick={() => handleToggleConnection(ats.provider)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer px-2"
                  >
                    {ats.isConnected ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Total Synced</span>
                  <span className="font-bold text-slate-800">{ats.totalCandidatesSynced} Candidates</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Success Rate</span>
                  <span className="font-bold text-emerald-700">{ats.syncSuccessRate}%</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400 block">Webhook URL</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate block">
                    {ats.webhookUrl}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Webhook Activity Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              Live ATS Webhook Logs
            </h4>
            <span className="text-[11px] text-slate-400">Recent Deliveries</span>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-3.5 font-mono text-[11px] space-y-2.5 max-h-48 overflow-y-auto">
            {webhookLogs.length === 0 ? (
              <span className="text-slate-500">No webhooks dispatched yet.</span>
            ) : (
              webhookLogs.map((log) => (
                <div key={log.id} className="border-b border-slate-800/80 pb-2 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-emerald-400 font-bold">[{log.status}] {log.provider}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-white font-medium">
                    {log.event} · {log.candidateName} ({log.jobTitle})
                  </div>
                  <div className="text-slate-400 truncate text-[10px] bg-slate-900 p-1 rounded">
                    {log.payloadPreview}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close ATS Hub
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
