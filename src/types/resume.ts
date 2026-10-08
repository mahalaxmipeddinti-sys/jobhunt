export type RequirementPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type SkillMatchStatus = "MATCHED" | "PARTIAL" | "MISSING";

export interface ParsedPersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface ParsedWorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  bullets: string[];
}

export interface ParsedEducation {
  id: string;
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
  coursework?: string[];
}

export interface ParsedProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  results?: string;
}

export interface ParsedCertification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
}

export interface ParsedSkills {
  technical: string[];
  tools: string[];
  platforms: string[];
  soft: string[];
}

export interface ParsedResumeData {
  personalInfo: ParsedPersonalInfo;
  summary: string;
  skills: ParsedSkills;
  experience: ParsedWorkExperience[];
  education: ParsedEducation[];
  projects: ParsedProject[];
  certifications: ParsedCertification[];
}

export interface CandidateResume {
  id: string;
  userId: string;
  title: string;
  filename: string;
  fileType: "pdf" | "docx" | "text";
  fileSize: string;
  uploadedAt: string;
  updatedAt: string;
  isDefault: boolean;
  version: number;
  parsedData: ParsedResumeData;
  parentResumeId?: string; // If optimized version for a job
  targetJobId?: string;
  targetJobTitle?: string;
}

export interface SkillGapItem {
  skill: string;
  status: SkillMatchStatus;
  priority: RequirementPriority;
  candidateEvidence?: string;
  transferableFrom?: string;
  reason: string;
  action: string;
  learningPath: string[];
}

export interface ResumeImprovementSuggestion {
  id: string;
  section: "summary" | "skills" | "experience" | "projects";
  itemId?: string; // id of experience/project if applicable
  originalText: string;
  suggestedText: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

export interface LearningResource {
  id: string;
  skill: string;
  title: string;
  platform: "YouTube" | "Official Docs" | "Coursera" | "Udemy" | "freeCodeCamp" | "Pluralsight";
  type: "free" | "paid";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  url: string;
  rating?: number;
  price?: string;
  hasCertificate: boolean;
  whyRecommended: string;
}

export interface JobSpecificLearningPlan {
  jobId: string;
  jobTitle: string;
  company: string;
  missingSkills: string[];
  timeCommitment: "1hr" | "2hrs" | "4hrs" | "weekend";
  days: Array<{
    day: number;
    title: string;
    tasks: string[];
    skill: string;
  }>;
  recommendedProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export interface AtsFinding {
  title: string;
  status: "pass" | "warn" | "tip";
  notes: string;
}

export interface JobResumeAnalysis {
  id: string;
  resumeId: string;
  resumeVersionId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  overallMatchScore: number; // 0 - 100%
  scoreBreakdown: {
    requiredSkillsScore: number;
    experienceAlignmentScore: number;
    roleAlignmentScore: number;
    projectScore: number;
  };
  atsFriendlinessScore: number; // 0 - 100%
  atsFindings: AtsFinding[];
  skillGaps: SkillGapItem[];
  matchedSkills: string[];
  partialSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
  suggestions: ResumeImprovementSuggestion[];
  keywords: Array<{
    word: string;
    category: string;
    inResume: boolean;
    importance: RequirementPriority;
  }>;
  learningResources: LearningResource[];
  learningPlan: JobSpecificLearningPlan;
  analyzedAt: string;
}

export interface LearningSkillProgress {
  skill: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: "Not Started" | "In Progress" | "Completed";
  progressPercent: number;
  evidenceProvided?: string;
  startedAt?: string;
  completedAt?: string;
}
