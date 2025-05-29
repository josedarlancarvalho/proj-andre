
import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "destructive";

export interface ToastActionElement {
  altText?: string;
}

export interface ToastProps {
  title?: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: ToastActionElement;
  duration?: number;
}

export interface ToastParams {
  title?: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: ToastActionElement;
}

const toasts: any[] = [];

export const useToast = () => {
  return {
    toast: ({ title, description, variant, action }: ToastParams) => {
      return sonnerToast[variant === "destructive" ? "error" : "success"](title, {
        description,
      });
    },
    toasts: toasts
  };
};

export function toast({ title, description, variant = "default", action }: ToastParams) {
  return sonnerToast[variant === "destructive" ? "error" : "success"](title, {
    description,
  });
}
