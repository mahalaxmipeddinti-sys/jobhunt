import { LearningResource } from "../../types/resume";

export interface SkillLearningDossier {
  skill: string;
  freeYouTube: LearningResource[];
  officialDocs: LearningResource[];
  paidCourses: LearningResource[];
  recommendedProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export const SKILL_LEARNING_CATALOG: Record<string, SkillLearningDossier> = {
  Docker: {
    skill: "Docker",
    freeYouTube: [
      {
        id: "yt-docker-1",
        skill: "Docker",
        title: "Docker Tutorial for Beginners (Full Course)",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "2 hours",
        url: "https://www.youtube.com/watch?v=pg19Z8LLKh8",
        hasCertificate: false,
        whyRecommended: "Comprehensive hands-on walkthrough of Dockerfiles, images, containers, and ports by TechWorld with Nana.",
      },
      {
        id: "yt-docker-2",
        skill: "Docker",
        title: "Docker in 100 Seconds + Hands-on Crash Course",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "45 mins",
        url: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
        hasCertificate: false,
        whyRecommended: "Fast-paced architectural overview with practical CLI workflow by Fireship.",
      },
    ],
    officialDocs: [
      {
        id: "doc-docker-1",
        skill: "Docker",
        title: "Docker Official Get Started Interactive Guide",
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "1.5 hours",
        url: "https://docs.docker.com/get-started/",
        hasCertificate: false,
        whyRecommended: "Authoritative, up-to-date documentation with step-by-step container build exercises.",
      },
    ],
    paidCourses: [
      {
        id: "paid-docker-1",
        skill: "Docker",
        title: "Docker Mastery: with Kubernetes + Swarm from a Docker Captain",
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "21 hours",
        url: "https://www.udemy.com/course/docker-mastery/",
        rating: 4.8,
        price: "$19.99",
        hasCertificate: true,
        whyRecommended: "Highest rated comprehensive production container engineering course by Bret Fisher.",
      },
      {
        id: "paid-docker-2",
        skill: "Docker",
        title: "Containerization with Docker and Kubernetes Fundamentals",
        platform: "Coursera",
        type: "paid",
        level: "Intermediate",
        duration: "4 weeks (flexible)",
        url: "https://www.coursera.org/learn/containerization-with-docker-and-kubernetes",
        rating: 4.7,
        hasCertificate: true,
        whyRecommended: "Offered by IBM with formal industry-recognized career credential.",
      },
    ],
    recommendedProject: {
      title: "Containerize a Multi-Service Web API with Docker Compose",
      description: "Build a multi-stage Dockerfile for a backend API, configure a PostgreSQL database service with persistent volume mounts, and orchestrate automated networking with Docker Compose.",
      deliverables: [
        "Optimized Dockerfile using multi-stage caching",
        "docker-compose.yml defining API, database, and Redis cache",
        "README.md documenting container startup scripts and health checks",
      ],
    },
  },
  Kubernetes: {
    skill: "Kubernetes",
    freeYouTube: [
      {
        id: "yt-k8s-1",
        skill: "Kubernetes",
        title: "Kubernetes Course for Beginners",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "3.5 hours",
        url: "https://www.youtube.com/watch?v=X48VuDVv0do",
        hasCertificate: false,
        whyRecommended: "Clear visual breakdown of Pods, Deployments, Services, and Ingress controllers by freeCodeCamp.",
      },
    ],
    officialDocs: [
      {
        id: "doc-k8s-1",
        skill: "Kubernetes",
        title: "Kubernetes Interactive Tutorials & Minikube Sandbox",
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "2 hours",
        url: "https://kubernetes.io/docs/tutorials/",
        hasCertificate: false,
        whyRecommended: "Browser-based interactive terminal scenarios running real kubectl commands.",
      },
    ],
    paidCourses: [
      {
        id: "paid-k8s-1",
        skill: "Kubernetes",
        title: "Certified Kubernetes Administrator (CKA) with Practice Tests",
        platform: "Udemy",
        type: "paid",
        level: "Advanced",
        duration: "23 hours",
        url: "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/",
        rating: 4.8,
        price: "$24.99",
        hasCertificate: true,
        whyRecommended: "Industry benchmark certification prep course with integrated interactive browser labs by Mumshad Mannambeth.",
      },
    ],
    recommendedProject: {
      title: "Deploy a Resilient Microservice Cluster on Local Minikube",
      description: "Deploy a stateless web service across 3 replicas, configure rolling update zero-downtime deployments, and set up horizontal pod autoscaling (HPA) based on CPU load.",
      deliverables: [
        "Kubernetes Deployment and ClusterIP Service manifests",
        "Ingress controller configuration with host-based routing",
        "ConfigMaps and Secrets separation for environment configs",
      ],
    },
  },
  AWS: {
    skill: "AWS",
    freeYouTube: [
      {
        id: "yt-aws-1",
        skill: "AWS",
        title: "AWS Certified Cloud Practitioner Course (CLF-C02)",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "4 hours",
        url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
        hasCertificate: false,
        whyRecommended: "Complete foundational review of EC2, S3, IAM, VPC, and RDS architecture by freeCodeCamp.",
      },
    ],
    officialDocs: [
      {
        id: "doc-aws-1",
        skill: "AWS",
        title: "AWS Skill Builder Free Digital Training Portal",
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "Self-paced",
        url: "https://explore.skillbuilder.aws/",
        hasCertificate: false,
        whyRecommended: "Over 600+ free digital courses built directly by Amazon Web Services curriculum experts.",
      },
    ],
    paidCourses: [
      {
        id: "paid-aws-1",
        skill: "AWS",
        title: "Ultimate AWS Certified Solutions Architect Associate",
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "27 hours",
        url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
        rating: 4.8,
        price: "$19.99",
        hasCertificate: true,
        whyRecommended: "World's most popular AWS architectural course by Stéphane Maarek with practical hands-on labs.",
      },
    ],
    recommendedProject: {
      title: "Automate Serverless API Deployment with AWS Lambda & S3",
      description: "Deploy a serverless REST API using AWS Lambda, API Gateway, and DynamoDB, secured with IAM least-privilege roles and automated via AWS SAM or Terraform.",
      deliverables: [
        "Infrastructure as Code (IaC) deployment template",
        "Serverless endpoint with authenticated JWT authorizer",
        "S3 bucket with lifecycle storage policies",
      ],
    },
  },
  PostgreSQL: {
    skill: "PostgreSQL",
    freeYouTube: [
      {
        id: "yt-pg-1",
        skill: "PostgreSQL",
        title: "PostgreSQL Full Course for Beginners",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "4 hours",
        url: "https://www.youtube.com/watch?v=qw--VYLpxG4",
        hasCertificate: false,
        whyRecommended: "Hands-on deep dive covering relational modeling, foreign keys, window functions, and indexing.",
      },
    ],
    officialDocs: [
      {
        id: "doc-pg-1",
        skill: "PostgreSQL",
        title: "PostgreSQL Official Tutorial & Indexing Manual",
        platform: "Official Docs",
        type: "free",
        level: "Intermediate",
        duration: "Self-paced",
        url: "https://www.postgresql.org/docs/current/tutorial.html",
        hasCertificate: false,
        whyRecommended: "Essential reference for EXPLAIN ANALYZE query planning, B-Tree vs GIN indexes, and transactions.",
      },
    ],
    paidCourses: [
      {
        id: "paid-pg-1",
        skill: "PostgreSQL",
        title: "The Complete Python/PostgreSQL Course 2.0",
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "18 hours",
        url: "https://www.udemy.com/course/complete-python-postgresql-database-course/",
        rating: 4.7,
        price: "$14.99",
        hasCertificate: true,
        whyRecommended: "Practical real-world database design for high-scale backend services.",
      },
    ],
    recommendedProject: {
      title: "Design a High-Throughput Relational Database with Partitioning & Indexes",
      description: "Create an e-commerce order processing schema with composite indexes, partial indexes for unfulfilled orders, and an automated audit trigger using PL/pgSQL.",
      deliverables: [
        "SQL DDL migration script with normalized foreign keys",
        "Query optimization report comparing EXPLAIN execution plans before/after indexing",
        "PL/pgSQL trigger function recording immutable audit logs",
      ],
    },
  },
  "SystemVerilog": {
    skill: "SystemVerilog",
    freeYouTube: [
      {
        id: "yt-sv-1",
        skill: "SystemVerilog",
        title: "SystemVerilog for Hardware Verification Crash Course",
        platform: "YouTube",
        type: "free",
        level: "Intermediate",
        duration: "3 hours",
        url: "https://www.youtube.com/watch?v=kY7mPqQ3E5Y",
        hasCertificate: false,
        whyRecommended: "Clear visual guide to SystemVerilog interfaces, clocking blocks, randomization, and coverage.",
      },
    ],
    officialDocs: [
      {
        id: "doc-sv-1",
        skill: "SystemVerilog",
        title: "ASIC World SystemVerilog Verification Guide",
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "Self-paced",
        url: "http://www.asic-world.com/systemverilog/tutorial.html",
        hasCertificate: false,
        whyRecommended: "Classic hardware design reference with working verification testbench snippets.",
      },
    ],
    paidCourses: [
      {
        id: "paid-sv-1",
        skill: "SystemVerilog",
        title: "SystemVerilog for Design and Verification with UVM",
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "14 hours",
        url: "https://www.udemy.com/course/systemverilog-verification/",
        rating: 4.8,
        price: "$29.99",
        hasCertificate: true,
        whyRecommended: "Targeted industry course taught by senior verification leads from semiconductor multinationals.",
      },
    ],
    recommendedProject: {
      title: "Design and Verify an Asynchronous FIFO in SystemVerilog",
      description: "Write synthesizable RTL for a multi-clock domain asynchronous FIFO with Gray-code pointer synchronization, and build an OOP SystemVerilog testbench with constrained-random stimulus and functional coverage.",
      deliverables: [
        "Synthesizable async_fifo.sv RTL module with CDC synchronizers",
        "OOP testbench with driver, generator, and scoreboard",
        "Functional coverage report achieving 100% boundary testing",
      ],
    },
  },
  TypeScript: {
    skill: "TypeScript",
    freeYouTube: [
      {
        id: "yt-ts-1",
        skill: "TypeScript",
        title: "TypeScript Full Course for Beginners",
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "2 hours",
        url: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        hasCertificate: false,
        whyRecommended: "Comprehensive guide to interfaces, generics, union types, and tsconfig by freeCodeCamp.",
      },
    ],
    officialDocs: [
      {
        id: "doc-ts-1",
        skill: "TypeScript",
        title: "TypeScript Official Handbook & Type Playground",
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "Self-paced",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        hasCertificate: false,
        whyRecommended: "Authoritative handbook explaining structural subtyping, utility types, and conditional types.",
      },
    ],
    paidCourses: [
      {
        id: "paid-ts-1",
        skill: "TypeScript",
        title: "Understanding TypeScript - 2026 Edition",
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "15 hours",
        url: "https://www.udemy.com/course/understanding-typescript/",
        rating: 4.8,
        price: "$16.99",
        hasCertificate: true,
        whyRecommended: "Best-selling course by Maximilian Schwarzmüller with deep dive into generics and decorators.",
      },
    ],
    recommendedProject: {
      title: "Build a Type-Safe REST API Client with Runtime Zod Validation",
      description: "Construct an HTTP API client library utilizing generic return types, conditional response narrowing, and Zod schemas that parse untrusted API payloads without casting.",
      deliverables: [
        "TypeScript library with zero `any` types in strict mode",
        "Generic API client interface with discriminating error unions",
        "Unit test suite verifying runtime schema parsing",
      ],
    },
  },
};

export function getSkillLearningDossier(skill: string): SkillLearningDossier {
  // Check exact or normalized match
  for (const [key, val] of Object.entries(SKILL_LEARNING_CATALOG)) {
    if (key.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }

  // Generative default dossier for any skill (AI-guided fallback)
  return {
    skill,
    freeYouTube: [
      {
        id: `yt-${skill.toLowerCase()}-1`,
        skill,
        title: `${skill} Crash Course for Professional Developers`,
        platform: "YouTube",
        type: "free",
        level: "Beginner",
        duration: "1.5 hours",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " full course tutorial")}`,
        hasCertificate: false,
        whyRecommended: `Top-ranked community video tutorial covering core ${skill} concepts and practical workflows.`,
      },
    ],
    officialDocs: [
      {
        id: `doc-${skill.toLowerCase()}-1`,
        skill,
        title: `${skill} Official Technical Documentation & Getting Started`,
        platform: "Official Docs",
        type: "free",
        level: "Beginner",
        duration: "Self-paced",
        url: `https://duckduckgo.com/?q=${encodeURIComponent(skill + " official documentation tutorial")}`,
        hasCertificate: false,
        whyRecommended: `Authoritative upstream documentation and architectural guides for ${skill}.`,
      },
    ],
    paidCourses: [
      {
        id: `paid-${skill.toLowerCase()}-1`,
        skill,
        title: `Complete ${skill} Masterclass: Zero to Mastery`,
        platform: "Udemy",
        type: "paid",
        level: "Intermediate",
        duration: "12 hours",
        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
        rating: 4.7,
        price: "$19.99",
        hasCertificate: true,
        whyRecommended: `Structured enterprise curriculum with hands-on coding exercises and certificate.`,
      },
    ],
    recommendedProject: {
      title: `Build a Functional Demo Application using ${skill}`,
      description: `Create a standalone open-source repository implementing ${skill} to solve a concrete business problem and demonstrate hands-on competence to recruiters.`,
      deliverables: [
        `Working codebase demonstrating ${skill} best practices`,
        `Comprehensive README.md with architecture overview and test instructions`,
        `Public GitHub repository link ready to include on your resume`,
      ],
    },
  };
}
