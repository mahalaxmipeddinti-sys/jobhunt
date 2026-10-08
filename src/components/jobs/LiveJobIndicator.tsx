import React from "react";
import { cn } from "../../lib/utils";

interface LiveJobIndicatorProps {
  isNew?: boolean;
  className?: string;
}

export const LiveJobIndicator: React.FC<LiveJobIndicatorProps> = ({
  isNew = false,
  className,
}) => {
  if (!isNew) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>LIVE</span>
    </span>
  );
};
