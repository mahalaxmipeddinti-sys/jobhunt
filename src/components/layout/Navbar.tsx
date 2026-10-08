import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { RealtimeLiveFeedButton } from "../common/RealtimeLiveFeed";
import { GlobalSearchBar } from "./GlobalSearchBar";
import {
  ShieldCheck,
  Briefcase,
  LayoutDashboard,
  FileText,
  User,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Radio,
  Sparkles,
  CheckCircle2,
  Search,
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, role, logout, switchPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [hoveredNavPath, setHoveredNavPath] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
  }

  const navItems: NavItem[] = [
    { label: "Jobs", path: "/jobs", icon: <Briefcase className="w-4 h-4" /> },
    ...(isAuthenticated && role === "candidate"
      ? [
          { label: "My Resumes", path: "/resumes", icon: <FileText className="w-4 h-4" /> },
          { label: "Learning", path: "/learning", icon: <Sparkles className="w-4 h-4" /> },
          { label: "Applications", path: "/applications", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> },
        ]
      : []),
    ...(isAuthenticated && role === "recruiter"
      ? [
          { label: "Dashboard", path: "/recruiter/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: "My Jobs", path: "/recruiter/jobs", icon: <Briefcase className="w-4 h-4" /> },
          { label: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      {/* Dev / Persona Test Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">JOBTRUST AI · Real-Time Discovery Engine</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Active persona:{" "}
              <strong className="text-white">
                {isAuthenticated
                  ? `${user?.name} (${role === "recruiter" ? "Recruiter" : "Candidate"})`
                  : "Guest (Not Logged In)"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Quick switch:</span>
            <div className="relative inline-flex items-center p-0.5 bg-slate-800 rounded-md">
              <button
                onClick={() => {
                  switchPersona("candidate");
                  navigate("/dashboard");
                }}
                className={`relative px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer z-10 ${
                  role === "candidate" ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {role === "candidate" && (
                  <motion.div
                    layoutId="persona-active-pill"
                    className="absolute inset-0 bg-blue-600 rounded"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Candidate (Alex)</span>
              </button>

              <button
                onClick={() => {
                  switchPersona("recruiter");
                  navigate("/recruiter/dashboard");
                }}
                className={`relative px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer z-10 ${
                  role === "recruiter" ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {role === "recruiter" && (
                  <motion.div
                    layoutId="persona-active-pill"
                    className="absolute inset-0 bg-indigo-600 rounded"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Recruiter (Sarah)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  JobTrust<span className="text-blue-600">.ai</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 -mt-1 tracking-wider uppercase">
                  Verified Hiring
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Smooth Motion Hover & Active Indicator */}
            <nav
              onMouseLeave={() => setHoveredNavPath(null)}
              className="hidden md:flex items-center gap-1 relative"
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                const isHovered = hoveredNavPath === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setHoveredNavPath(item.path)}
                    className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                      active
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {/* Hover Motion pill following cursor between navigation items */}
                    {isHovered && !active && (
                      <motion.div
                        layoutId="nav-cursor-hover-pill"
                        className="absolute inset-0 bg-slate-100/90 rounded-md -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                          mass: 0.7,
                        }}
                      />
                    )}

                    {/* Active item highlight */}
                    {active && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-blue-50/80 rounded-md -z-10 border border-blue-100"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                          mass: 0.7,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className={active ? "text-blue-600" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Global Search Bar: Title, Company, Location */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md items-center justify-center px-2">
            <GlobalSearchBar />
          </div>

          {/* Right Action / Real-time Notification / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Real-time Job Applications Live Feed Button */}
            <RealtimeLiveFeedButton />

            {role === "recruiter" && (
              <Link to="/recruiter/jobs/create">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Job
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-xs text-slate-700">
                    {user?.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize leading-none mt-1">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button, Search Toggle & Realtime */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                mobileSearchOpen
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              title="Search opportunities"
              aria-label="Toggle search bar"
            >
              <Search className="w-5 h-5" />
            </button>

            <RealtimeLiveFeedButton />

            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (onToggleSidebar) onToggleSidebar();
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown Row */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-100">
            <GlobalSearchBar className="max-w-full" />
          </div>
        )}
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Search inside dropdown */}
          <div className="pb-1">
            <GlobalSearchBar className="max-w-full" />
          </div>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span className="text-slate-400">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {role === "recruiter" && (
            <Link
              to="/recruiter/jobs/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Post New Job
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  Signed in as <strong>{user?.name}</strong> ({user?.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
