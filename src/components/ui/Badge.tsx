import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "muted" | "warning";
  className?: string;
}

export function Badge({ children, variant = "muted", className }: BadgeProps) {
  const variants = {
    brand: "badge-brand",
    success: "badge-success",
    muted: "badge-muted",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={cn("badge", variants[variant], className)}>{children}</span>
  );
}
