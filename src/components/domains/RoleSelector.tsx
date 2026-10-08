import React, { useState } from "react";
import { motion } from "motion/react";
import { JOB_ROLES } from "../../lib/taxonomy/roles";
import { cn } from "../../lib/utils";

interface RoleSelectorProps {
  selectedDomain: string;
  selectedRole: string;
  onSelectRole: (roleName: string) => void;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedDomain,
  selectedRole,
  onSelectRole,
  className,
}) => {
  const [hoveredRoleId, setHoveredRoleId] = useState<string | null>(null);

  // Filter roles relevant to the selected domain (or popular roles if "all")
  const roles = React.useMemo(() => {
    if (!selectedDomain || selectedDomain === "all") {
      return [
        { id: "all", name: "All Roles" },
        ...JOB_ROLES.slice(0, 10).map((r) => ({ id: r.id, name: r.name })),
      ];
    }
    const filtered = JOB_ROLES.filter((r) => r.domainId === selectedDomain);
    return [
      { id: "all", name: "All " + selectedDomain.toUpperCase() + " Roles" },
      ...filtered.map((r) => ({ id: r.id, name: r.name })),
    ];
  }, [selectedDomain]);

  if (roles.length <= 1) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onMouseLeave={() => setHoveredRoleId(null)}
        className="relative flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
      >
        <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
          Filter Role:
        </span>
        {roles.map((r) => {
          const isSelected =
            (r.id === "all" && (!selectedRole || selectedRole === "all")) ||
            selectedRole.toLowerCase() === r.name.toLowerCase();
          const isHovered = hoveredRoleId === r.id;

          return (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectRole(r.id === "all" ? "all" : r.name)}
              onMouseEnter={() => setHoveredRoleId(r.id)}
              className={cn(
                "relative px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 border select-none outline-none",
                isSelected
                  ? "bg-blue-50 text-blue-700 border-blue-200/90 font-semibold"
                  : "bg-white text-slate-600 border-slate-200/80"
              )}
            >
              {/* Dynamic hover pill gliding as cursor transitions between options */}
              {isHovered && !isSelected && (
                <motion.div
                  layoutId="role-cursor-hover-pill"
                  className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
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
                  layoutId="role-active-pill"
                  className="absolute inset-0 bg-blue-50 border border-blue-200/90 rounded-lg -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 480,
                    damping: 32,
                    mass: 0.75,
                  }}
                />
              )}

              <span className="relative z-10">{r.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
