import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-primary border-t-transparent",
        sizeClasses[size],
        className,
      )}
    />
  );
};

export const LoadingSpinner = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="bg-background/80 backdrop-blur-sm border-none shadow-none flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
