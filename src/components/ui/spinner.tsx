
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary" | "success";
};

export const Spinner = ({ 
  className, 
  size = "md", 
  variant = "default" 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const variantClasses = {
    default: "border-primary border-t-transparent",
    primary: "border-blue-600 border-t-transparent",
    secondary: "border-slate-600 border-t-transparent", 
    success: "border-green-600 border-t-transparent"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
};
