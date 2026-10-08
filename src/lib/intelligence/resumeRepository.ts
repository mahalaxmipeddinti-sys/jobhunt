import { CandidateResume, JobResumeAnalysis } from "../../types/resume";

const RESUMES_STORAGE_KEY = "jobtrust_resumes_store_v1";
const ANALYSES_STORAGE_KEY = "jobtrust_resume_analyses_store_v1";

export const INITIAL_RESUMES: CandidateResume[] = [
  {
    id: "res-alex-1",
    userId: "user-cand-1",
    title: "Alex Mercer — Senior Full Stack & Distributed Systems",
    filename: "Alex_Mercer_FullStack_Resume_2026.pdf",
    fileType: "pdf",
    fileSize: "148 KB",
    uploadedAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
    isDefault: true,
    version: 1,
    parsedData: {
      personalInfo: {
        name: "Alex Mercer",
        email: "alex.mercer@example.com",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA",
        linkedIn: "https://linkedin.com/in/alex-mercer-dev",
        github: "https://github.com/alexmercer-io",
        portfolio: "https://alexmercer.dev",
      },
      summary: "Senior software engineer with 5+ years of experience architecting high-throughput distributed web applications, event-driven microservices, and reactive user interfaces using TypeScript, React, Node.js, and PostgreSQL.",
      skills: {
        technical: ["TypeScript", "JavaScript", "Python", "React", "Node.js", "PostgreSQL", "Next.js", "Tailwind CSS", "REST APIs", "GraphQL", "Redis", "Git", "Linux"],
        tools: ["Docker", "Git", "VS Code", "Postman", "Jest", "Vite", "Webpack"],
        platforms: ["AWS (S3, EC2)", "Linux", "Node.js", "Docker", "GitHub Actions"],
        soft: ["Technical Leadership", "System Design", "Agile/Scrum", "Code Reviews", "Cross-Functional Collaboration"],
      },
      experience: [
        {
          id: "exp-1",
          company: "Apex Cloud Technologies",
          role: "Senior Full Stack Engineer",
          duration: "2023 – Present",
          location: "San Francisco, CA",
          bullets: [
            "Architected multi-region real-time telemetry streaming service using Node.js and PostgreSQL, serving 1.2M daily active requests with sub-40ms P99 latency.",
            "Spearheaded migration of legacy frontend monolithic architecture to Next.js and TypeScript, reducing initial page bundle payload by 42%.",
            "Implemented automated CI/CD container test validation pipelines with GitHub Actions and Docker, reducing staging deployment cycle times by 65%.",
          ],
        },
        {
          id: "exp-2",
          company: "Horizon Interactive Labs",
          role: "Full Stack Software Developer",
          duration: "2021 – 2023",
          location: "San Jose, CA",
          bullets: [
            "Engineered responsive React web dashboard incorporating complex WebSocket real-time charts and accessible UI components.",
            "Designed and optimized PostgreSQL schema indices and Redis caching layers, resolving database read contention during high-traffic spikes.",
            "Mentored 4 junior engineering teammates through structured pair programming sessions and architectural reviews.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          degree: "B.S. in Computer Science",
          institution: "University of California, Berkeley",
          year: "2021",
          gpa: "3.85 / 4.0",
          coursework: ["Distributed Systems", "Operating Systems", "Algorithms & Data Structures", "Database Systems"],
        },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Distributed Task Scheduler & Queue Protocol",
          description: "High-throughput asynchronous task orchestrator written in TypeScript and Redis with at-least-once delivery guarantees and distributed leader election.",
          technologies: ["TypeScript", "Node.js", "Redis", "Docker"],
          results: "Processed 50,000 tasks/sec with zero task dropouts across simulated node partition tests.",
        },
        {
          id: "proj-2",
          title: "React Component Token System",
          description: "Accessible, headless design system with full WCAG AA compliance, fluid typography tokens, and automated Storybook visual regression suites.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
          results: "Adopted by 6 internal squad repositories with 100% TypeScript type coverage.",
        },
      ],
      certifications: [
        {
          id: "cert-1",
          title: "AWS Certified Cloud Practitioner (CLF-C02)",
          issuer: "Amazon Web Services",
          date: "2025",
        },
      ],
    },
  },
  {
    id: "res-priya-2",
    userId: "user-cand-1",
    title: "Alex Mercer — Frontend & UI/UX Specialist",
    filename: "Alex_Mercer_Frontend_Resume.docx",
    fileType: "docx",
    fileSize: "112 KB",
    uploadedAt: "2026-03-24T14:00:00Z",
    updatedAt: "2026-03-24T14:00:00Z",
    isDefault: false,
    version: 1,
    parsedData: {
      personalInfo: {
        name: "Alex Mercer",
        email: "alex.mercer@example.com",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA",
        linkedIn: "https://linkedin.com/in/alex-mercer-dev",
        portfolio: "https://alexmercer.dev",
      },
      summary: "Frontend engineering specialist focused on high-performance React architectures, TypeScript design tokens, CSS layouts, and micro-frontend integrations.",
      skills: {
        technical: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Next.js", "Tailwind CSS", "Figma", "Redux", "Zustand", "Webpack", "Vite"],
        tools: ["Figma", "Storybook", "Chrome DevTools", "Jest", "Playwright"],
        platforms: ["Vercel", "Web Browsers", "Node.js"],
        soft: ["Design Systems", "Accessibility (WCAG)", "Prototyping", "User Experience Empathy"],
      },
      experience: [
        {
          id: "exp-fe-1",
          company: "Apex Cloud Technologies",
          role: "Lead Frontend Engineer",
          duration: "2023 – Present",
          location: "San Francisco, CA",
          bullets: [
            "Built design system tokens used across 14 enterprise SaaS micro-frontends.",
            "Achieved 100% Lighthouse Performance and Accessibility scores across core landing and dashboard surfaces.",
          ],
        },
      ],
      education: [
        {
          id: "edu-fe-1",
          degree: "B.S. in Computer Science",
          institution: "University of California, Berkeley",
          year: "2021",
        },
      ],
      projects: [
        {
          id: "proj-fe-1",
          title: "Fluid Design Token Engine",
          description: "Figma-to-code synchronized design token compiler generating CSS custom properties and TypeScript type definitions.",
          technologies: ["TypeScript", "Figma API", "Tailwind CSS"],
        },
      ],
      certifications: [],
    },
  },
];

export class ResumeRepository {
  public static getResumes(userId: string = "user-cand-1"): CandidateResume[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(RESUMES_STORAGE_KEY);
        if (raw) {
          const list: CandidateResume[] = JSON.parse(raw);
          if (list.length > 0) return list;
        }
      }
    } catch (e) {
      console.warn("Error reading resumes from localStorage", e);
    }
    // Return initial default seed
    return INITIAL_RESUMES;
  }

  public static saveResumes(resumes: CandidateResume[]): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
      }
    } catch (e) {
      console.warn("Error saving resumes to localStorage", e);
    }
  }

  public static getResumeById(id: string): CandidateResume | undefined {
    const all = this.getResumes();
    return all.find((r) => r.id === id);
  }

  public static getDefaultResume(userId: string = "user-cand-1"): CandidateResume {
    const all = this.getResumes(userId);
    return all.find((r) => r.isDefault) || all[0] || INITIAL_RESUMES[0];
  }

  public static setDefaultResume(id: string): void {
    const all = this.getResumes();
    const updated = all.map((r) => ({
      ...r,
      isDefault: r.id === id,
    }));
    this.saveResumes(updated);
  }

  public static deleteResume(id: string): void {
    const all = this.getResumes();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length > 0 && !filtered.some((r) => r.isDefault)) {
      filtered[0].isDefault = true;
    }
    this.saveResumes(filtered);
  }

  public static renameResume(id: string, newTitle: string): void {
    const all = this.getResumes();
    const updated = all.map((r) =>
      r.id === id ? { ...r, title: newTitle.trim(), updatedAt: new Date().toISOString() } : r
    );
    this.saveResumes(updated);
  }

  public static addResume(resume: CandidateResume): void {
    const all = this.getResumes();
    if (resume.isDefault) {
      all.forEach((r) => (r.isDefault = false));
    }
    this.saveResumes([resume, ...all]);
  }

  // --- Analyses Cache & History ---

  public static getAnalyses(): JobResumeAnalysis[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(ANALYSES_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error reading analyses from localStorage", e);
    }
    return [];
  }

  public static saveAnalysis(analysis: JobResumeAnalysis): void {
    try {
      const all = this.getAnalyses();
      // Replace if same resume and job
      const filtered = all.filter(
        (a) => !(a.resumeId === analysis.resumeId && a.jobId === analysis.jobId)
      );
      const updated = [analysis, ...filtered];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
      }
    } catch (e) {
      console.warn("Error saving analysis to localStorage", e);
    }
  }

  public static getAnalysis(resumeId: string, jobId: string): JobResumeAnalysis | undefined {
    const all = this.getAnalyses();
    return all.find((a) => a.resumeId === resumeId && a.jobId === jobId);
  }

  public static deleteAnalysis(id: string): void {
    const all = this.getAnalyses();
    const updated = all.filter((a) => a.id !== id);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn(e);
    }
  }
}
