import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  showArrow = true,
  disabled,
}: ButtonProps) {
  const baseStyles =
    "group inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-brand px-6 py-3 text-white shadow-sm hover:bg-brand-bright active:scale-[0.99]",
    secondary:
      "bg-surface px-6 py-3 text-text border border-border shadow-sm hover:bg-surface-soft active:scale-[0.99]",
    ghost: "px-2 py-2 text-text-muted hover:text-brand",
    outline:
      "border border-border-strong px-6 py-3 text-text hover:border-brand hover:text-brand",
  };

  const content = (
    <>
      <span>{children}</span>
      {showArrow && variant !== "ghost" && (
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </>
  );

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
