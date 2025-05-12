import { toast as shadcnToast } from "@/components/ui/use-toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return shadcnToast({
      title: options?.title || "Success",
      description: message,
      duration: options?.duration || 3000,
      className: "toast-success animate-in slide-in-from-right-full",
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return shadcnToast({
      title: options?.title || "Error",
      description: message,
      duration: options?.duration || 5000,
      className: "toast-error animate-in slide-in-from-right-full",
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return shadcnToast({
      title: options?.title || "Information",
      description: message,
      duration: options?.duration || 4000,
      className: "toast-info animate-in slide-in-from-right-full",
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return shadcnToast({
      title: options?.title || "Warning",
      description: message,
      duration: options?.duration || 4000,
      className: "toast-warning animate-in slide-in-from-right-full",
    });
  },
};
