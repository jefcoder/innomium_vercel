"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/navigation/UserMenu";
import { mainNav } from "@/lib/content/site";
import { navIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/profiles/types";

interface NavbarProps {
  user?: Profile | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg-pure/90 backdrop-blur-md">
      <div className="section-container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNav.map((item) => {
            const Icon = navIcons[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-soft text-brand-deep"
                    : "text-text-muted hover:bg-surface-strong hover:text-text"
                )}
              >
                <Icon size={16} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button href="/login" variant="ghost" showArrow={false}>
                Sign In
              </Button>
              <Button href="/signup" showArrow={false}>
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-text-muted hover:bg-surface-strong lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-bg-pure lg:hidden">
          <nav className="section-container flex flex-col gap-1 py-4">
            {mainNav.map((item) => {
              const Icon = navIcons[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-strong"
                >
                  <Icon size={18} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Button href="/login" variant="outline" showArrow={false}>
                    Sign In
                  </Button>
                  <Button href="/signup" showArrow={false}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
