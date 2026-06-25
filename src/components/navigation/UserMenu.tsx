"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { signOut } from "@/lib/auth/actions";
import { homeForAccountType } from "@/lib/supabase/middleware";
import type { Profile } from "@/lib/profiles/types";

interface UserMenuProps {
  user: Profile;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dashboardPath = homeForAccountType(user.account_type);
  const displayName = user.display_name || user.full_name || "Account";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm hover:bg-surface-soft"
      >
        <UserAvatar name={displayName} imageUrl={user.avatar_url} size="sm" />
        <span className="hidden max-w-[120px] truncate font-medium sm:inline">
          {displayName}
        </span>
        <ChevronDown size={16} className="text-text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-surface py-1 shadow-lg">
          <Link
            href={dashboardPath}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-soft"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href={`${dashboardPath}/settings`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-soft"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} />
            Settings
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-surface-soft"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
