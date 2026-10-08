import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "border border-slate-200 bg-white text-slate-900 shadow-lg text-sm rounded-lg font-sans",
        duration: 3500,
      }}
    />
  );
};

export { toast } from "sonner";
