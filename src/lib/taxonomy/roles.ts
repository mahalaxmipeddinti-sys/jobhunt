export interface RoleDefinition {
  id: string;
  name: string;
  domainId: string;
  categoryId?: string;
  aliases: string[];
}

export const JOB_ROLES: RoleDefinition[] = [
  // IT Roles
  { id: "fullstack-dev", name: "Full Stack Developer", domainId: "it", categoryId: "it-software", aliases: ["full stack", "fullstack", "web developer"] },
  { id: "frontend-dev", name: "Frontend Developer", domainId: "it", categoryId: "it-software", aliases: ["frontend", "front-end", "react", "next.js", "ui developer"] },
  { id: "backend-dev", name: "Backend Developer", domainId: "it", categoryId: "it-software", aliases: ["backend", "back-end", "node", "python", "java", "go", "api engineer"] },
  { id: "software-eng", name: "Software Engineer", domainId: "it", categoryId: "it-software", aliases: ["software developer", "sde", "swe", "programmer"] },
  { id: "devops-eng", name: "DevOps Engineer", domainId: "it", categoryId: "it-cloud", aliases: ["devops", "sre", "platform engineer", "infrastructure engineer"] },
  { id: "cloud-eng", name: "Cloud Engineer", domainId: "it", categoryId: "it-cloud", aliases: ["cloud architect", "aws engineer", "gcp engineer", "azure engineer"] },
  { id: "data-analyst", name: "Data Analyst", domainId: "it", categoryId: "it-data", aliases: ["bi analyst", "data visualization", "sql analyst"] },
  { id: "data-scientist", name: "Data Scientist", domainId: "it", categoryId: "it-data", aliases: ["data science", "machine learning researcher"] },
  { id: "aiml-eng", name: "AI/ML Engineer", domainId: "it", categoryId: "it-data", aliases: ["ai engineer", "ml engineer", "deep learning", "llm engineer"] },
  { id: "cyber-eng", name: "Cybersecurity Engineer", domainId: "it", categoryId: "it-security", aliases: ["security analyst", "infosec", "soc analyst", "penetration tester"] },
  { id: "qa-eng", name: "QA / Automation Engineer", domainId: "it", categoryId: "it-qa", aliases: ["qa engineer", "sdet", "test engineer", "automation tester"] },
  { id: "uiux-designer", name: "UI/UX Designer", domainId: "it", categoryId: "it-design", aliases: ["product designer", "ux designer", "ui designer", "interaction designer"] },
  { id: "mobile-dev", name: "Mobile App Developer", domainId: "it", categoryId: "it-software", aliases: ["android developer", "ios developer", "flutter developer", "react native"] },

  // Government Roles
  { id: "gov-upsc", name: "UPSC / Civil Services", domainId: "government", categoryId: "gov-civil", aliases: ["upsc", "ias", "ips", "ifs", "civil service"] },
  { id: "gov-ssc", name: "SSC Staff Selection", domainId: "government", categoryId: "gov-ssc", aliases: ["ssc cgl", "ssc chsl", "sub-inspector", "stenographer"] },
  { id: "gov-po", name: "Bank Probationary Officer (PO)", domainId: "government", categoryId: "gov-banking", aliases: ["bank po", "ibps po", "sbi po", "specialist officer"] },
  { id: "gov-rrb", name: "Railway Recruitment (RRB)", domainId: "government", categoryId: "gov-railways", aliases: ["railway", "rrb ntpc", "station master", "section engineer"] },
  { id: "gov-defence", name: "Defence & Military Services", domainId: "government", categoryId: "gov-defence", aliases: ["cds", "nda", "afcat", "drdo scientist"] },
  { id: "gov-state-psc", name: "State Public Service Commission", domainId: "government", categoryId: "gov-state", aliases: ["appsc", "tspsc", "kpsc", "mpsc", "uppsc", "tnpsc"] },
  { id: "gov-psu-eng", name: "PSU Graduate Engineer", domainId: "government", categoryId: "gov-psu", aliases: ["gate psu", "ongc", "bhel", "iocl", "ntpc engineer"] },

  // Engineering Roles
  { id: "eng-vlsi", name: "VLSI / Silicon Design Engineer", domainId: "engineering", categoryId: "eng-vlsi", aliases: ["vlsi", "asic", "fpga", "rtl design", "digital design"] },
  { id: "eng-rtl", name: "RTL Design & Verification", domainId: "engineering", categoryId: "eng-vlsi", aliases: ["rtl design", "uvm", "systemverilog", "design verification"] },
  { id: "eng-embedded", name: "Embedded Firmware Engineer", domainId: "engineering", categoryId: "eng-embedded", aliases: ["embedded systems", "firmware", "iot engineer", "microcontroller"] },
  { id: "eng-electronics", name: "Electronics & Hardware Engineer", domainId: "engineering", categoryId: "eng-electrical", aliases: ["hardware engineer", "pcb designer", "circuit design"] },
  { id: "eng-mechanical", name: "Mechanical Systems Engineer", domainId: "engineering", categoryId: "eng-mechanical", aliases: ["mechanical engineer", "cad designer", "automotive engineer"] },
  { id: "eng-civil", name: "Civil & Structural Engineer", domainId: "engineering", categoryId: "eng-civil", aliases: ["civil engineer", "site engineer", "structural engineer"] },

  // Fresher & Internships
  { id: "fresher-general", name: "Graduate Trainee / Fresher", domainId: "fresher", categoryId: "fresher-campus", aliases: ["fresher", "entry level", "graduate trainee", "associate"] },
  { id: "intern-general", name: "Technology / Engineering Intern", domainId: "internships", categoryId: "intern-tech", aliases: ["intern", "summer intern", "co-op", "trainee"] },
];
