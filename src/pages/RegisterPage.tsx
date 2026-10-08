import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { MotionSegmentedControl } from "../components/ui/motion-tabs";
import { toast } from "../components/ui/toaster";
import { ShieldCheck, User, Building } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole: UserRole =
    searchParams.get("role") === "recruiter" ? "recruiter" : "candidate";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = "Full name is required";
    }

    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (role === "recruiter" && !companyName.trim()) {
      errs.companyName = "Company or organization name is required";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      if (role === "candidate") {
        await register({
          role: "candidate",
          name,
          email,
          password,
          confirmPassword,
        });
        toast.success("Account created successfully! Welcome to JobTrust AI.");
        navigate("/dashboard");
      } else {
        await register({
          role: "recruiter",
          name,
          email,
          password,
          confirmPassword,
          companyName,
        });
        toast.success("Recruiter account registered! Welcome aboard.");
        navigate("/recruiter/dashboard");
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to create account. Please try again." });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-xs">
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex w-10 h-10 rounded-lg bg-blue-50 text-blue-600 items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h1>
          <p className="text-xs text-slate-500">
            Join JobTrust AI to discover verified opportunities
          </p>
        </div>

        {/* Role Toggle Selector with Motion Cursor Transition */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            I am registering as:
          </label>
          <MotionSegmentedControl
            idPrefix="register-role"
            size="md"
            options={[
              {
                value: "candidate",
                label: "Candidate",
                icon: <User className="w-3.5 h-3.5" />,
              },
              {
                value: "recruiter",
                label: "Recruiter",
                icon: <Building className="w-3.5 h-3.5" />,
              },
            ]}
            value={role}
            onChange={(val) => setRole(val as UserRole)}
            className="w-full grid grid-cols-2"
          />
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="reg-name"
            label="Full name"
            type="text"
            placeholder={role === "candidate" ? "Alex Mercer" : "Sarah Lin"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          {role === "recruiter" && (
            <Input
              id="reg-company"
              label="Company or organization"
              type="text"
              placeholder="e.g. Acme Cloud Infrastructure"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
              required
            />
          )}

          <Input
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="name@work.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            id="reg-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <Input
            id="reg-confirm-password"
            label="Confirm password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
