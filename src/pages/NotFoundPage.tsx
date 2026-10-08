import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-6">
        <ShieldAlert className="w-8 h-8 text-slate-600 stroke-[1.5]" />
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
        Error 404
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
        We couldn't find that page.
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
        The link you followed may be expired or the address might be incorrect. Explore active and verified opportunities on our main jobs board.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/jobs">
          <Button variant="primary" size="md" className="gap-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="md">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
