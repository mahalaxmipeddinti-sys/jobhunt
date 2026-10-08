import { JobDomainId } from "../../../types/normalizedJob";
import { JOB_ROLES } from "../../taxonomy/roles";
import { JOB_CATEGORIES } from "../../taxonomy/categories";

export interface ClassificationResult {
  domain: JobDomainId;
  category: string;
  role: string;
  skills: string[];
}

const COMMON_TECH_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Java", "Go", "Kubernetes",
  "Docker", "AWS", "SQL", "PostgreSQL", "Next.js", "Tailwind CSS", "C++",
  "Rust", "GraphQL", "MongoDB", "Linux", "Terraform", "Git", "FastAPI"
];

const COMMON_ENG_SKILLS = [
  "Verilog", "SystemVerilog", "VHDL", "RTL Design", "FPGA", "UVM",
  "Embedded C", "Microcontrollers", "RTOS", "PCB Design", "MATLAB", "CAD",
  "AutoCAD", "SolidWorks", "PLC", "Circuit Design"
];

const COMMON_GOV_SKILLS = [
  "General Studies", "Public Administration", "Aptitude & Reasoning",
  "Banking Knowledge", "Quantitative Ability", "Indian Polity", "Economics"
];

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesSkill(skill: string, text: string): boolean {
  const lowerSkill = skill.toLowerCase();
  const lowerText = text.toLowerCase();

  // For skills with non-word symbols like C++, C#, .NET
  if (lowerSkill.includes("+") || lowerSkill.includes("#") || lowerSkill.startsWith(".")) {
    return lowerText.includes(lowerSkill);
  }

  try {
    const escaped = escapeRegExp(lowerSkill);
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    return regex.test(lowerText);
  } catch {
    return lowerText.includes(lowerSkill);
  }
}

export function classifyJob(
  title: string,
  description: string,
  tags: string[] = [],
  explicitDomainHint?: JobDomainId
): ClassificationResult {
  const combined = `${title} ${description} ${tags.join(" ")}`.toLowerCase();

  // 1. Identify Role by matching configured taxonomy aliases
  let matchedRole = JOB_ROLES.find((r) =>
    r.aliases.some((alias) => combined.includes(alias.toLowerCase()))
  );

  // Default role fallback based on title if no exact alias
  const defaultRoleName = matchedRole ? matchedRole.name : title.split(/[-–—|:]/)[0].trim();

  // 2. Identify Domain
  let domain: JobDomainId = explicitDomainHint || "it";

  if (explicitDomainHint) {
    domain = explicitDomainHint;
  } else if (
    combined.includes("upsc") ||
    combined.includes("ssc ") ||
    combined.includes("rrb ") ||
    combined.includes("civil service") ||
    combined.includes("public sector") ||
    combined.includes("sbi po") ||
    combined.includes("ibps") ||
    combined.includes("government") ||
    combined.includes("gazette")
  ) {
    domain = "government";
  } else if (
    combined.includes("vlsi") ||
    combined.includes("rtl design") ||
    combined.includes("embedded") ||
    combined.includes("semiconductor") ||
    combined.includes("asic") ||
    combined.includes("verilog") ||
    combined.includes("mechanical") ||
    combined.includes("civil engineering") ||
    combined.includes("electrical engineer")
  ) {
    domain = "engineering";
  } else if (combined.includes("fresher") || combined.includes("entry level") || combined.includes("0-1 year") || combined.includes("batch 2026") || combined.includes("batch 2025")) {
    domain = "fresher";
  } else if (combined.includes("intern") || combined.includes("internship") || combined.includes("trainee")) {
    domain = "internships";
  } else if (combined.includes("remote") || combined.includes("work from anywhere") || combined.includes("wfh")) {
    domain = "remote";
  } else if (matchedRole) {
    domain = matchedRole.domainId as JobDomainId;
  }

  // 3. Identify Category
  let category = "General Opportunities";
  if (matchedRole?.categoryId) {
    const foundCat = JOB_CATEGORIES.find((c) => c.id === matchedRole?.categoryId);
    if (foundCat) category = foundCat.name;
  } else if (domain === "government") {
    category = "Government Recruitment";
  } else if (domain === "engineering") {
    category = "Core Engineering & Hardware";
  } else if (domain === "it") {
    category = "Software & Technology";
  }

  // 4. Extract Skills
  const detectedSkills = new Set<string>();
  const allSkillPool = [...COMMON_TECH_SKILLS, ...COMMON_ENG_SKILLS, ...COMMON_GOV_SKILLS];
  for (const skill of allSkillPool) {
    if (matchesSkill(skill, combined)) {
      detectedSkills.add(skill);
    }
  }

  // Also include explicit tags from source
  for (const tag of tags) {
    if (tag.length > 1 && tag.length < 25) {
      detectedSkills.add(tag);
    }
  }

  return {
    domain,
    category,
    role: defaultRoleName,
    skills: Array.from(detectedSkills).slice(0, 8),
  };
}
