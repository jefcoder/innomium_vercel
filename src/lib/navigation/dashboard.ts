import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Lock,
  Code2,
  Trophy,
  Users,
  CreditCard,
  Settings,
  User,
  BadgeCheck,
  Calendar,
  Briefcase,
  Star,
  DollarSign,
  Shield,
  GitMerge,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const clientNav: NavItem[] = [
  { label: "Overview", href: "/client", icon: LayoutDashboard },
  { label: "Requests", href: "/client/requests", icon: FileText },
  { label: "Consults", href: "/client/consults", icon: MessageSquare },
  { label: "Proprietary", href: "/client/proprietary-consults", icon: Lock },
  { label: "Tasks", href: "/client/tasks", icon: Code2 },
  { label: "Competitions", href: "/client/competitions", icon: Trophy },
  { label: "Talents", href: "/client/talents", icon: Users },
  { label: "Messages", href: "/client/messages", icon: MessageSquare },
  { label: "Payments", href: "/client/payments", icon: CreditCard },
  { label: "Settings", href: "/client/settings", icon: Settings },
];

export const talentNav: NavItem[] = [
  { label: "Overview", href: "/talent", icon: LayoutDashboard },
  { label: "Profile", href: "/talent/profile", icon: User },
  { label: "Skills", href: "/talent/skills", icon: BadgeCheck },
  { label: "Availability", href: "/talent/availability", icon: Calendar },
  { label: "Opportunities", href: "/talent/opportunities", icon: Briefcase },
  { label: "Consults", href: "/talent/consults", icon: MessageSquare },
  { label: "Tasks", href: "/talent/tasks", icon: Code2 },
  { label: "Competitions", href: "/talent/competitions", icon: Trophy },
  { label: "Earnings", href: "/talent/earnings", icon: DollarSign },
  { label: "Reputation", href: "/talent/reputation", icon: Star },
  { label: "Messages", href: "/talent/messages", icon: MessageSquare },
  { label: "Settings", href: "/talent/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/talent-applications", icon: ClipboardList },
  { label: "Skill Verification", href: "/admin/skill-verification", icon: BadgeCheck },
  { label: "Client Requests", href: "/admin/client-requests", icon: FileText },
  { label: "Matching", href: "/admin/matching", icon: GitMerge },
  { label: "Competitions", href: "/admin/competitions", icon: Trophy },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  { label: "Reports", href: "/admin/reports", icon: Shield },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
