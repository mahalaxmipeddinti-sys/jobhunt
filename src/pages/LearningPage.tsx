import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  GraduationCap,
  ShieldCheck,
  Flame,
  Clock,
} from "lucide-react";

interface LearningTrack {
  id: string;
  title: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  description: string;
  topics: string[];
  completedCount: number;
  totalModules: number;
}

const INITIAL_TRACKS: LearningTrack[] = [
  {
    id: "track-cloud-arch",
    title: "Enterprise Cloud Architecture & Distributed Systems",
    domain: "Software & Technology",
    difficulty: "Advanced",
    estimatedHours: 18,
    description: "Master distributed caching (Redis), event-driven microservices, containerization with Docker & Kubernetes, and PostgreSQL indexing.",
    topics: ["Distributed Caching & Redis", "Kafka & RabbitMQ Queues", "Kubernetes Cluster Orchestration", "PostgreSQL Query Optimization"],
    completedCount: 3,
    totalModules: 5,
  },
  {
    id: "track-upsc-eng",
    title: "Engineering Services Examination (ESE) Tech Fundamentals",
    domain: "Government & Public Service",
    difficulty: "Intermediate",
    estimatedHours: 24,
    description: "Comprehensive syllabus alignment for UPSC Indian Engineering Services and State Public Service Commission technical recruitment examinations.",
    topics: ["Engineering Ethics & Project Management", "Network Theory & Information Systems", "Public Sector Compliance & Procurement", "Data Analysis for Public Governance"],
    completedCount: 2,
    totalModules: 6,
  },
  {
    id: "track-fullstack-ts",
    title: "Full-Stack TypeScript & High-Performance React Patterns",
    domain: "Frontend & Full Stack",
    difficulty: "Intermediate",
    estimatedHours: 12,
    description: "Deep dive into React 19 server components, state management, accessibility compliance, and TypeScript generics.",
    topics: ["Advanced TypeScript Generics & Type Guards", "React Concurrent Rendering & Suspense", "Web Vitals & Performance Budgeting", "Modern CI/CD Deployment Workflows"],
    completedCount: 4,
    totalModules: 4,
  },
  {
    id: "track-ai-embeddings",
    title: "AI Embeddings & Vector Semantic Search Engineering",
    domain: "Artificial Intelligence",
    difficulty: "Advanced",
    estimatedHours: 16,
    description: "Learn how modern vector databases (Pinecone, pgvector) index candidate profiles, job descriptions, and semantic proximity calculation.",
    topics: ["Cosine Similarity & Vector Proximity", "pgvector Setup on PostgreSQL", "LLM Fine-Tuning & Prompt Pipelines", "Real-Time Ranking & Deduplication"],
    completedCount: 1,
    totalModules: 4,
  },
];

export const LearningPage: React.FC = () => {
  const [tracks, setTracks] = useState<LearningTrack[]>(INITIAL_TRACKS);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredTracks = tracks.filter((t) => {
    if (selectedFilter === "all") return true;
    return t.difficulty.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Personalized Career Advancement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Skill Gap Bridging & Learning Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Close competency gaps detected across verified job requisitions and prepare for technical screenings.
          </p>
        </div>

        <Link to="/jobs">
          <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
            Browse Live Opportunities
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Active Learning Tracks</span>
          <div className="text-2xl font-extrabold text-slate-900">{tracks.length} Tracks</div>
          <p className="text-[11px] text-slate-500">Aligned with live employer demand</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Modules Completed</span>
          <div className="text-2xl font-extrabold text-emerald-700">10 / 19 Modules</div>
          <p className="text-[11px] text-slate-500">52% Overall curriculum completion</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Estimated Match Boost</span>
          <div className="text-2xl font-extrabold text-blue-700">+18% Match</div>
          <p className="text-[11px] text-slate-500">Upon completing bridge tracks</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-2">Filter Level:</span>
        {["all", "intermediate", "advanced"].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedFilter(level)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
              selectedFilter === level
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Tracks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTracks.map((track) => {
          const progressPercent = Math.round((track.completedCount / track.totalModules) * 100);
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {track.domain}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{track.estimatedHours} hrs</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {track.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {track.description}
                </p>

                {/* Topics Pills */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Competencies Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {track.topics.map((tp) => (
                      <span
                        key={tp}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold text-slate-900">
                      {track.completedCount} of {track.totalModules} modules ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-slate-600">
                    Difficulty: <span className="font-bold text-slate-900">{track.difficulty}</span>
                  </span>
                  <Link to="/jobs">
                    <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
                      <span>Explore Jobs for this Track</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
