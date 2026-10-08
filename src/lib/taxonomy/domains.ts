export interface DomainDefinition {
  id: string;
  name: string;
  iconName: string;
  description: string;
  accentColor: string; // Tailwind color class key
  badgeBg: string;
  badgeText: string;
  popularRoles: string[];
}

export const JOB_DOMAINS: DomainDefinition[] = [
  {
    id: "all",
    name: "All Opportunities",
    iconName: "Compass",
    description: "Discover all live vacancies across technology, government, engineering, and remote sectors.",
    accentColor: "blue",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    popularRoles: ["Software Engineer", "UPSC", "Frontend Developer", "Data Analyst"],
  },
  {
    id: "government",
    name: "Government Jobs",
    iconName: "Landmark",
    description: "Official public-sector, civil service, banking, railway, and national recruitment vacancies.",
    accentColor: "amber",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    popularRoles: ["UPSC", "SSC", "Banking", "Railways", "Defence", "Public Sector"],
  },
  {
    id: "it",
    name: "IT & Technology",
    iconName: "Laptop",
    description: "Software engineering, cloud infrastructure, AI/ML, cybersecurity, and modern tech roles.",
    accentColor: "blue",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    popularRoles: ["Full Stack Developer", "Backend Developer", "DevOps Engineer", "AI/ML Engineer"],
  },
  {
    id: "engineering",
    name: "Core Engineering",
    iconName: "Cpu",
    description: "Semiconductor, VLSI, Embedded Systems, Electrical, Mechanical, and Civil engineering positions.",
    accentColor: "emerald",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    popularRoles: ["VLSI Engineer", "Embedded Engineer", "RTL Design", "Mechanical Engineer"],
  },
  {
    id: "fresher",
    name: "Fresher Jobs",
    iconName: "GraduationCap",
    description: "Entry-level openings, graduate training schemes, and opportunities requiring 0–1 years experience.",
    accentColor: "violet",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    popularRoles: ["Graduate Trainee", "Junior Developer", "Associate Analyst", "Support Engineer"],
  },
  {
    id: "internships",
    name: "Internship Jobs",
    iconName: "Briefcase",
    description: "Paid student and early-career internships across engineering, technology, and analytics.",
    accentColor: "teal",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    popularRoles: ["Software Intern", "Design Intern", "Research Intern", "Engineering Intern"],
  },
  {
    id: "remote",
    name: "Remote Jobs",
    iconName: "Globe",
    description: "Verified work-from-anywhere roles with competitive global and regional compensation.",
    accentColor: "sky",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    popularRoles: ["Remote Software Engineer", "DevOps Consultant", "Technical Writer", "Frontend Dev"],
  },
  {
    id: "regional",
    name: "Regional Jobs",
    iconName: "MapPin",
    description: "Location-targeted opportunities across major state tech hubs and regional economic zones.",
    accentColor: "rose",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    popularRoles: ["Regional Lead", "Site Engineer", "Branch Manager", "Field Analyst"],
  },
  {
    id: "finance",
    name: "Finance & Banking",
    iconName: "Coins",
    description: "Financial analysis, investment, corporate accounting, fintech, and risk assessment.",
    accentColor: "indigo",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    popularRoles: ["Financial Analyst", "Probationary Officer", "Accountant", "Risk Analyst"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    iconName: "HeartPulse",
    description: "Clinical research, health informatics, biomedical engineering, and health-tech systems.",
    accentColor: "emerald",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    popularRoles: ["Biomedical Engineer", "Health Data Analyst", "Clinical Informatics"],
  },
];
