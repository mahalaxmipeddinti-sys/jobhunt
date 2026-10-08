import React from "react";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We couldn't complete the requested action right now. Please try again or check back shortly.",
  onRetry,
  retryLabel = "Try Again",
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-rose-200/70 shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
