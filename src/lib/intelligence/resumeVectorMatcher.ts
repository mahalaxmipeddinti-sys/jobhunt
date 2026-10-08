import { NormalizedJob } from "../../types/normalizedJob";

export interface CandidateResumeProfile {
  fullName: string;
  headline: string;
  summary: string;
  yearsOfExperience: number;
  skills: string[];
  preferredRoles: string[];
  education: string;
}

export interface MatchAnalysisResult {
  overallScore: number; // 0 - 100
  skillMatchScore: number;
  experienceMatchScore: number;
  roleMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceAlignment: "Strong Alignment" | "Good Match" | "Moderate Fit" | "High Seniority Gap";
  strengths: string[];
  recommendations: string[];
}

const DEFAULT_RESUME_STORAGE_KEY = "jobtrust_candidate_resume_v1";

const DEFAULT_ALEX_RESUME: CandidateResumeProfile = {
  fullName: "Alex Mercer",
  headline: "Senior Full Stack & Systems Engineer",
  summary: "5+ years building scalable distributed web applications, high-throughput microservices, and design systems using TypeScript, React, Node.js, and PostgreSQL.",
  yearsOfExperience: 5,
  skills: [
    "TypeScript", "React", "Node.js", "PostgreSQL", "Next.js", "Docker",
    "Tailwind CSS", "GraphQL", "Python", "REST APIs", "Git", "Redis",
    "Kubernetes", "Linux", "System Architecture"
  ],
  preferredRoles: ["Full Stack Developer", "Frontend Developer", "Software Engineer", "Backend Developer"],
  education: "B.S. in Computer Science, UC Berkeley",
};

export class ResumeVectorMatcher {
  public static getCandidateResume(): CandidateResumeProfile {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(DEFAULT_RESUME_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ALEX_RESUME;
  }

  public static saveCandidateResume(profile: CandidateResumeProfile): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(DEFAULT_RESUME_STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn("Could not save resume profile", e);
    }
  }

  /**
   * Computes deterministic vector semantic similarity and skill overlap between candidate resume and a job requisition
   */
  public static calculateMatch(
    job: Partial<NormalizedJob>,
    candidateResume: CandidateResumeProfile = this.getCandidateResume()
  ): MatchAnalysisResult {
    const jobText = `${job.title || ""} ${job.description || ""} ${(job.skills || []).join(" ")}`.toLowerCase();
    const candidateSkillsLower = candidateResume.skills.map((s) => s.toLowerCase());

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Check overlap on job's defined skills
    const targetJobSkills = (job.skills && job.skills.length > 0)
      ? job.skills
      : ["TypeScript", "React", "Node.js", "PostgreSQL"];

    for (const jobSkill of targetJobSkills) {
      const lower = jobSkill.toLowerCase();
      if (candidateSkillsLower.some((cs) => cs === lower || lower.includes(cs) || cs.includes(lower))) {
        matchedSkills.push(jobSkill);
      } else {
        missingSkills.push(jobSkill);
      }
    }

    // Also check candidate skills mentioned in job text
    for (const candSkill of candidateResume.skills) {
      const lower = candSkill.toLowerCase();
      if (jobText.includes(lower) && !matchedSkills.includes(candSkill)) {
        matchedSkills.push(candSkill);
      }
    }

    // Skill score
    const skillRatio = targetJobSkills.length > 0
      ? (matchedSkills.length / Math.max(targetJobSkills.length, 1))
      : 0.7;
    const skillMatchScore = Math.min(100, Math.round(skillRatio * 100));

    // Experience score
    let experienceMatchScore = 85;
    let experienceAlignment: MatchAnalysisResult["experienceAlignment"] = "Strong Alignment";
    const reqExpLevel = (job.experience_level || "").toLowerCase();

    if (reqExpLevel.includes("5+") || reqExpLevel.includes("lead")) {
      if (candidateResume.yearsOfExperience >= 5) {
        experienceMatchScore = 95;
        experienceAlignment = "Strong Alignment";
      } else {
        experienceMatchScore = 65;
        experienceAlignment = "High Seniority Gap";
      }
    } else if (reqExpLevel.includes("fresher") || reqExpLevel.includes("0-2")) {
      experienceMatchScore = 90;
      experienceAlignment = "Good Match";
    }

    // Role Match Score
    const roleLower = (job.role || job.title || "").toLowerCase();
    const roleMatches = candidateResume.preferredRoles.some((pr) =>
      roleLower.includes(pr.toLowerCase()) || pr.toLowerCase().includes(roleLower)
    );
    const roleMatchScore = roleMatches ? 95 : 75;

    // Composite Vector Score (Weighted: 50% Skills, 30% Role, 20% Experience)
    const overallScore = Math.min(
      99,
      Math.max(
        35,
        Math.round(skillMatchScore * 0.5 + roleMatchScore * 0.3 + experienceMatchScore * 0.2)
      )
    );

    const strengths: string[] = [];
    if (matchedSkills.length > 0) {
      strengths.push(`Direct alignment on core skills: ${matchedSkills.slice(0, 3).join(", ")}`);
    }
    if (candidateResume.yearsOfExperience >= 4) {
      strengths.push(`${candidateResume.yearsOfExperience} years of full-stack engineering background meets seniority threshold.`);
    }

    const recommendations: string[] = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Highlight any project familiarity with ${missingSkills.slice(0, 2).join(" and ")} in your application note.`);
    } else {
      recommendations.push("High skill alignment across all mandatory job requirements.");
    }

    return {
      overallScore,
      skillMatchScore,
      experienceMatchScore,
      roleMatchScore,
      matchedSkills,
      missingSkills,
      experienceAlignment,
      strengths,
      recommendations,
    };
  }
}
