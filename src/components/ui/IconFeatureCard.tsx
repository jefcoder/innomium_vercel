import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function IconFeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: IconFeatureCardProps) {
  return (
    <div className={cn("card-surface p-6", className)}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon size={22} strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{description}</p>
    </div>
  );
}
