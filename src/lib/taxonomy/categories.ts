export interface CategoryDefinition {
  id: string;
  domainId: string;
  name: string;
  description: string;
}

export const JOB_CATEGORIES: CategoryDefinition[] = [
  // Government
  { id: "gov-civil", domainId: "government", name: "Civil Services & UPSC", description: "All-India civil administration and state civil services." },
  { id: "gov-ssc", domainId: "government", name: "Staff Selection Commission (SSC)", description: "Central government ministerial and departmental posts." },
  { id: "gov-banking", domainId: "government", name: "Public Sector Banking (IBPS / SBI / RBI)", description: "Officer, PO, Clerk, and Specialist Officer vacancies." },
  { id: "gov-railways", domainId: "government", name: "Railways (RRB)", description: "Technical and non-technical railway recruitment boards." },
  { id: "gov-defence", domainId: "government", name: "Defence & Paramilitary", description: "Army, Navy, Air Force, DRDO, and defence research vacancies." },
  { id: "gov-state", domainId: "government", name: "State Government Portals", description: "State public service commissions and regional secretariats." },
  { id: "gov-psu", domainId: "government", name: "Public Sector Undertakings (PSU)", description: "Maharatna and Navratna PSU engineering & management posts." },

  // IT & Technology
  { id: "it-software", domainId: "it", name: "Software Development", description: "Frontend, Backend, and Full Stack application development." },
  { id: "it-cloud", domainId: "it", name: "DevOps & Cloud Systems", description: "Infrastructure as code, Kubernetes, CI/CD, AWS/GCP/Azure." },
  { id: "it-data", domainId: "it", name: "Data & Artificial Intelligence", description: "Data engineering, machine learning pipelines, and predictive analytics." },
  { id: "it-security", domainId: "it", name: "Cybersecurity & InfoSec", description: "Vulnerability research, penetration testing, and security analysis." },
  { id: "it-qa", domainId: "it", name: "Quality Assurance & Testing", description: "Automated test suites, end-to-end testing, and reliability engineering." },
  { id: "it-design", domainId: "it", name: "UI/UX & Product Design", description: "Design systems, user research, and wireframe prototyping." },

  // Engineering
  { id: "eng-vlsi", domainId: "engineering", name: "Semiconductor & VLSI", description: "ASIC, FPGA, RTL design, and physical verification." },
  { id: "eng-embedded", domainId: "engineering", name: "Embedded Systems & IoT", description: "Firmware, microcontrollers, and hardware-software integration." },
  { id: "eng-electrical", domainId: "engineering", name: "Electrical & Electronics", description: "Power systems, circuits, and electronic component manufacturing." },
  { id: "eng-mechanical", domainId: "engineering", name: "Mechanical & Automation", description: "CAD/CAM, thermodynamics, and industrial automation." },
  { id: "eng-civil", domainId: "engineering", name: "Civil & Infrastructure", description: "Structural analysis, transport planning, and public works." },

  // Fresher & Internships
  { id: "fresher-campus", domainId: "fresher", name: "Campus & Graduate Hires", description: "Structured training programs for recent batch graduates." },
  { id: "intern-tech", domainId: "internships", name: "Technology Internships", description: "Software development and engineering student internships." },

  // Remote
  { id: "remote-global", domainId: "remote", name: "Global Remote", description: "Async and distributed positions open worldwide." },
];
