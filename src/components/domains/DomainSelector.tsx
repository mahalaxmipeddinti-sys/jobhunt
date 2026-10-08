import React, { useState } from "react";
import { motion } from "motion/react";
import { JOB_DOMAINS } from "../../lib/taxonomy/domains";
import {
  Compass,
  Landmark,
  Laptop,
  Cpu,
  GraduationCap,
  Briefcase,
  Globe,
  MapPin,
  Coins,
  HeartPulse,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface DomainSelectorProps {
  selectedDomain: string;
  onSelectDomain: (domainId: string) => void;
  className?: string;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Coins: <Coins className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
};

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  selectedDomain,
  onSelectDomain,
  className,
}) => {
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Explore Job Domains
        </h2>
        <span className="text-xs text-slate-400">
          {JOB_DOMAINS.length - 1} Verified Categories
        </span>
      </div>

      <div
        onMouseLeave={() => setHoveredDomainId(null)}
        className="relative flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x"
      >
        {JOB_DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          const isHovered = hoveredDomainId === domain.id;
          const icon = ICONS_MAP[domain.iconName] || <Compass className="w-4 h-4" />;

          return (
            <motion.button
              key={domain.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectDomain(domain.id)}
              onMouseEnter={() => setHoveredDomainId(domain.id)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer snap-start border shrink-0 outline-none select-none",
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200/90"
              )}
            >
              {/* Dynamic sliding motion pill following cursor from option to option */}
              {isHovered && !isSelected && (
                <motion.div
                  layoutId="domain-cursor-hover-pill"
                  className="absolute inset-0 bg-blue-50/80 border border-blue-200/80 rounded-xl -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 32,
                    mass: 0.7,
                  }}
                />
              )}

              {/* Active selection motion indicator */}
              {isSelected && (
                <motion.div
                  layoutId="domain-active-pill"
                  className="absolute inset-0 bg-slate-900 border border-slate-900 rounded-xl -z-10 shadow-xs"
                  transition={{
                    type: "spring",
                    stiffness: 480,
                    damping: 32,
                    mass: 0.75,
                  }}
                />
              )}

              <span
                className={cn(
                  "p-1 rounded-lg transition-colors relative z-10",
                  isSelected
                    ? "bg-slate-800 text-blue-400"
                    : isHovered
                    ? "bg-blue-100/70 text-blue-700"
                    : "bg-slate-100 text-slate-500 group-hover:text-slate-900"
                )}
              >
                {icon}
              </span>
              <span className="relative z-10">{domain.name}</span>

              {/* Active subtle pulsing indicator */}
              {isSelected && (
                <motion.span
                  layoutId="active-domain-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 relative z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
