export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected"
  | "Selected";

export type AtsProviderName = "Greenhouse" | "Lever" | "Workday";

export interface AtsSyncInfo {
  status: "synced" | "pending" | "failed";
  atsProvider: AtsProviderName;
  candidateAtsId: string;
  syncedAt: string;
  webhookDelivered: boolean;
  atsRequisitionCode?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobLocation: string;
  employmentType: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;

  // Phase 5: Semantic Match & Resume Embeddings
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  experienceMatch?: string;

  // Recruitment Cadence
  interviewStage?: string;
  recruiterFeedback?: string;

  // Phase 6: ATS Integration
  atsSync?: AtsSyncInfo;
}

export interface ApplyJobInput {
  jobId: string;
  notes?: string;
  matchScore?: number;
}
