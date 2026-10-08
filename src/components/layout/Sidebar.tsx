import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  LayoutDashboard,
  CheckCircle2,
  FileText,
  Sparkles,
  User,
  PlusCircle,
  Layers,
  ShieldCheck,
  Building2,
  X,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("candidate" | "recruiter")[];
  isAdminOrRecruiterHub?: boolean; // Explicitly designates administrative or recruiter-specific hubs
  badge?: string;
  description?: string;
}

export const ALL_NAVIGATION_ITEMS: NavItemConfig[] = [
  // Candidate & General Navigation Items
  {
    id: "jobs",
    label: "Explore Jobs",
    path: "/jobs",
    icon: Briefcase,
    roles: ["candidate", "recruiter"],
    description: "Verified vacancies & ghost-job audited postings",
  },
  {
    id: "candidate-dashboard",
    label: "Candidate Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["candidate"],
    description: "Application stages & interview tracker",
  },
  {
    id: "applications",
    label: "My Applications",
    path: "/applications",
    icon: CheckCircle2,
    roles: ["candidate"],
    description: "Submitted pipelines & recruiter feedback",
  },
  {
    id: "resumes",
    label: "Resume Studio",
    path: "/resumes",
    icon: FileText,
    roles: ["candidate"],
    description: "Vector embeddings & skill profile",
  },
  {
    id: "learning",
    label: "Skill Learning",
    path: "/learning",
    icon: Sparkles,
    roles: ["candidate"],
    description: "Bridge competency gaps for top jobs",
  },
  {
    id: "profile",
    label: "Profile & Settings",
    path: "/profile",
    icon: User,
    roles: ["candidate", "recruiter"],
    description: "Account details & preferences",
  },

  // Administrative / Recruiter-Specific Hubs (strictly excluded from candidate's view automatically)
  {
    id: "recruiter-dashboard",
    label: "Recruiter Workspace",
    path: "/recruiter/dashboard",
    icon: LayoutDashboard,
    roles: ["recruiter"],
    isAdminOrRecruiterHub: true,
    description: "Hiring analytics & live applicant stream",
  },
  {
    id: "recruiter-jobs",
    label: "Requisition Hub",
    path: "/recruiter/jobs",
    icon: Layers,
    roles: ["recruiter"],
    isAdminOrRecruiterHub: true,
    description: "Manage active jobs & candidates",
  },
  {
    id: "recruiter-create-job",
    label: "Post New Job",
    path: "/recruiter/jobs/create",
    icon: PlusCircle,
    roles: ["recruiter"],
    isAdminOrRecruiterHub: true,
    badge: "New",
    description: "Publish vacancies to verified networks",
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  className = "",
}) => {
  const { user, isAuthenticated, role, logout, switchPersona } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  /**
   * Dynamically render navigation items based on the user's role:
   * Ensures that administrative or recruiter-specific hubs are excluded from the candidate's view automatically.
   */
  const dynamicNavItems = useMemo(() => {
    const activeRole = (role || "candidate") as "candidate" | "recruiter";

    return ALL_NAVIGATION_ITEMS.filter((item) => {
      // 1. Automatic Exclusion Rule: If user is a candidate, all administrative or recruiter hubs MUST be excluded
      if (activeRole === "candidate" && item.isAdminOrRecruiterHub) {
        return false;
      }

      // 2. Strict Role Verification Rule: Ensure item permits the active role
      if (!item.roles.includes(activeRole)) {
        return false;
      }

      // 3. Unauthenticated guest fallback
      if (!isAuthenticated && item.path !== "/jobs") {
        return false;
      }

      return true;
    });
  }, [role, isAuthenticated]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Component with CSS selector .sidebar-nav-container */}
      <aside
        className={`sidebar-nav-container ${className} fixed lg:static top-0 bottom-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } rounded-xl shadow-xs`}
      >
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Sidebar Top: Role & Workspace Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                  role === "recruiter" ? "bg-indigo-600" : "bg-blue-600"
                }`}
              >
                {role === "recruiter" ? (
                  <Building2 className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {role === "recruiter" ? "Recruiter Workspace" : "Candidate Workspace"}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {role === "recruiter" ? "Admin Management" : "Applicant Space"}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md"
                aria-label="Close navigation sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Profile Mini Banner */}
          {isAuthenticated && user && (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700 shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {role === "recruiter" ? user.companyName || "Employer" : "Candidate"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Navigation Items Section */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role === "recruiter" ? "Recruiter Hubs" : "Candidate Hubs"}
            </div>

            <nav className="space-y-1">
              {dynamicNavItems.map((item) => {
                const active = isActive(item.path);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={`relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      active
                        ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs border border-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${
                          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Persona Switcher Quick Sandbox */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Role Simulator:
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  switchPersona("candidate");
                  if (onClose) onClose();
                }}
                className={`py-1 px-2 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                  role === "candidate"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => {
                  switchPersona("recruiter");
                  if (onClose) onClose();
                }}
                className={`py-1 px-2 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                  role === "recruiter"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Recruiter
              </button>
            </div>
            <p className="text-[10px] text-slate-400 px-1 leading-tight">
              {role === "candidate"
                ? "Administrative recruiter hubs are automatically excluded from candidate view."
                : "Recruiter administrative hubs are currently visible."}
            </p>
          </div>
        </div>

        {/* Sidebar Footer: Verified Badge & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-Time Engine Active</span>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => onClose && onClose()}
              className="w-full block text-center py-1.5 text-xs font-semibold text-blue-600 hover:underline"
            >
              Sign In to Your Workspace
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
