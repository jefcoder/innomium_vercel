import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "icon";
  className?: string;
  iconSize?: number;
  showWordmark?: boolean;
}

export function Logo({
  variant = "horizontal",
  className,
  iconSize = 32,
  showWordmark = true,
}: LogoProps) {
  if (variant === "icon") {
    return (
      <div className={cn("inline-flex shrink-0", className)}>
        <Image
          src="/icon.svg"
          alt="Innomium"
          width={iconSize}
          height={iconSize}
          className="shrink-0"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/icon.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        aria-hidden
        priority
      />
      {showWordmark && (
        <span className="text-sm font-bold tracking-[0.06em] uppercase text-text">
          Innomium
        </span>
      )}
    </div>
  );
}
