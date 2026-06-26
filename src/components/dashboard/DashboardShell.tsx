"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  Calendar,
  ClipboardList,
  Code2,
  CreditCard,
  DollarSign,
  FileText,
  GitMerge,
  LayoutDashboard,
  Lock,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Star,
  Trophy,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { UserMenu } from "@/components/navigation/UserMenu";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import type { DashboardIcon, NavItem } from "@/lib/navigation/dashboard";
import type { Profile } from "@/lib/profiles/types";
import { cn } from "@/lib/utils";

const navIcons: Record<DashboardIcon, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  fileText: FileText,
  messageSquare: MessageSquare,
  lock: Lock,
  code2: Code2,
  trophy: Trophy,
  users: Users,
  creditCard: CreditCard,
  settings: Settings,
  user: User,
  badgeCheck: BadgeCheck,
  calendar: Calendar,
  briefcase: Briefcase,
  dollarSign: DollarSign,
  star: Star,
  shield: Shield,
  gitMerge: GitMerge,
  alertTriangle: AlertTriangle,
  clipboardList: ClipboardList,
};

interface DashboardShellProps {
  user: Profile;
  nav: NavItem[];
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ user, nav, title, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg-pure/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted hover:bg-surface-strong lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/">
              <Logo iconSize={28} />
            </Link>
            <span className="hidden text-sm font-medium text-text-muted sm:inline">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userId={user.id} />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-surface pt-14 transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {nav.map((item) => {
              const Icon = navIcons[item.icon];
              const active =
                pathname === item.href ||
                (item.href !== nav[0].href && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-soft text-brand-deep"
                      : "text-text-muted hover:bg-surface-soft hover:text-text"
                  )}
                >
                  <Icon size={18} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
