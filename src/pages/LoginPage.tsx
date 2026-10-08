import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toaster";
import { ShieldCheck, ArrowRight, UserCheck, Briefcase } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate(from === "/login" ? "/dashboard" : from);
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to log in. Please check credentials." });
    }
  };

  // Demo credential autofill
  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-xs">
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex w-10 h-10 rounded-lg bg-blue-50 text-blue-600 items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to JobTrust AI</h1>
          <p className="text-xs text-slate-500">Access your verified jobs, applications, and profile</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="login-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Demo Fast-Login Helpers */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Demo quick fill:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("alex.mercer@example.com")}
              className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 text-left transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold leading-tight">Alex Mercer</div>
                <div className="text-[10px] text-slate-500">Candidate</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("sarah.lin@acmecloud.io")}
              className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 text-left transition-colors cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold leading-tight">Sarah Lin</div>
                <div className="text-[10px] text-slate-500">Recruiter</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
