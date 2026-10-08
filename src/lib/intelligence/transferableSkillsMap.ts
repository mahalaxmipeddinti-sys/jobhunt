export interface TransferableRelationship {
  sourceSkill: string;
  targetSkill: string;
  transferability: "high" | "medium";
  bridgeDescription: string;
  recommendedBridgeAction: string;
}

export const TRANSFERABLE_SKILLS_MAP: TransferableRelationship[] = [
  {
    sourceSkill: "Azure",
    targetSkill: "AWS",
    transferability: "high",
    bridgeDescription: "Candidate already possesses enterprise Azure cloud architecture experience. Core IAM, VPC, and compute primitives map cleanly to AWS EC2, S3, and ECS.",
    recommendedBridgeAction: "Complete a 3-hour AWS Cloud Practitioner architecture mapping guide to translate Azure terminology.",
  },
  {
    sourceSkill: "GCP",
    targetSkill: "AWS",
    transferability: "high",
    bridgeDescription: "Candidate has Google Cloud platform familiarity. Cloud Storage, GKE, and IAM translate straightforwardly to AWS S3, EKS, and IAM.",
    recommendedBridgeAction: "Review AWS IAM role delegation and VPC peering patterns compared to GCP Projects.",
  },
  {
    sourceSkill: "React",
    targetSkill: "Angular",
    transferability: "medium",
    bridgeDescription: "Candidate is fluent in TypeScript and component-driven reactive state machines, easing the transition to Angular dependency injection.",
    recommendedBridgeAction: "Study Angular services, RxJS Observables, and RxJS state operators.",
  },
  {
    sourceSkill: "React",
    targetSkill: "Next.js",
    transferability: "high",
    bridgeDescription: "Next.js is built directly upon React. Candidate already knows React hooks, component lifecycle, and JSX.",
    recommendedBridgeAction: "Learn Next.js App Router server components, Server Actions, and incremental static regeneration.",
  },
  {
    sourceSkill: "Python",
    targetSkill: "Java",
    transferability: "medium",
    bridgeDescription: "Candidate understands backend algorithmic design, OOP abstractions, and data processing. Syntax is strongly typed in Java.",
    recommendedBridgeAction: "Practice Java 17+ type safety, Spring Boot dependency injection, and Maven/Gradle builds.",
  },
  {
    sourceSkill: "Java",
    targetSkill: "Go",
    transferability: "high",
    bridgeDescription: "Candidate has strong backend OOP and multithreading experience. Go goroutines and channel semantics are fast to grasp.",
    recommendedBridgeAction: "Complete 'A Tour of Go' focusing on goroutines, channels, and interface composition.",
  },
  {
    sourceSkill: "Node.js",
    targetSkill: "Go",
    transferability: "medium",
    bridgeDescription: "Candidate is experienced with asynchronous I/O and microservices. Go brings compiled performance and strict type concurrency.",
    recommendedBridgeAction: "Build a high-concurrency microservice in Go comparing goroutines to the Node.js event loop.",
  },
  {
    sourceSkill: "PostgreSQL",
    targetSkill: "MySQL",
    transferability: "high",
    bridgeDescription: "Candidate has relational database schema design, indexing, and SQL mastery. Core ANSI-SQL translates directly.",
    recommendedBridgeAction: "Review MySQL InnoDB locking semantics and replication quirks.",
  },
  {
    sourceSkill: "PostgreSQL",
    targetSkill: "MongoDB",
    transferability: "medium",
    bridgeDescription: "Candidate understands database modeling and querying. MongoDB shifts relational foreign keys to document nesting.",
    recommendedBridgeAction: "Practice MongoDB aggregation pipelines and indexing strategies for unstructured documents.",
  },
  {
    sourceSkill: "Verilog",
    targetSkill: "SystemVerilog",
    transferability: "high",
    bridgeDescription: "Candidate has HDL design fundamentals. SystemVerilog extends Verilog with enhanced verification testbench constructs and assertions.",
    recommendedBridgeAction: "Focus on SystemVerilog OOP testbench features, UVM basics, and SystemVerilog Assertions (SVA).",
  },
  {
    sourceSkill: "C++",
    targetSkill: "Rust",
    transferability: "medium",
    bridgeDescription: "Candidate understands manual memory layout, pointers, and systems programming. Rust replaces pointers with the borrow checker.",
    recommendedBridgeAction: "Study the Rust Book chapters on Ownership, Borrowing, Lifetimes, and smart pointers.",
  },
  {
    sourceSkill: "Docker",
    targetSkill: "Kubernetes",
    transferability: "high",
    bridgeDescription: "Candidate knows container images, Dockerfiles, and port mappings. Kubernetes orchestrates multi-container Docker workloads.",
    recommendedBridgeAction: "Learn Pod, Deployment, Service, and Ingress manifests using Minikube or Kind.",
  },
];

export function findTransferableSkill(
  requiredSkill: string,
  candidateSkills: string[]
): TransferableRelationship | undefined {
  const reqLower = requiredSkill.toLowerCase();
  const candSet = new Set(candidateSkills.map((s) => s.toLowerCase()));

  for (const rel of TRANSFERABLE_SKILLS_MAP) {
    if (rel.targetSkill.toLowerCase() === reqLower && candSet.has(rel.sourceSkill.toLowerCase())) {
      return rel;
    }
  }
  return undefined;
}
