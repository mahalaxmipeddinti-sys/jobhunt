import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export interface MotionOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
}

interface MotionSegmentedControlProps<T extends string = string> {
  options: MotionOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  idPrefix?: string;
  size?: "sm" | "md" | "lg";
}

export function MotionSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  idPrefix = "motion-tabs",
  size = "md",
}: MotionSegmentedControlProps<T>) {
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
    lg: "px-4 py-2 text-sm sm:text-base gap-2.5",
  }[size];

  return (
    <div
      onMouseLeave={() => setHoveredValue(null)}
      className={cn(
        "relative flex flex-wrap items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 select-none",
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isHovered = hoveredValue === option.value;

        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            onMouseEnter={() => setHoveredValue(option.value)}
            className={cn(
              "relative flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              sizeClasses,
              isSelected ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {/* Hover motion pill gliding with cursor movement */}
            {isHovered && !isSelected && (
              <motion.div
                layoutId={`${idPrefix}-hover-pill`}
                className="absolute inset-0 bg-white/70 rounded-lg shadow-2xs pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                  mass: 0.7,
                }}
              />
            )}

            {/* Active selection motion pill gliding across options */}
            {isSelected && (
              <motion.div
                layoutId={`${idPrefix}-active-pill`}
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/60 pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 32,
                  mass: 0.75,
                }}
              />
            )}

            {/* Content with stable relative z-index */}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon && (
                <span className={cn(isSelected ? "text-blue-600" : "text-slate-400")}>
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors",
                    isSelected
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-200/70 text-slate-500"
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
