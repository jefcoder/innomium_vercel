import {
  MessageSquare,
  Lock,
  Code2,
  Trophy,
  BadgeCheck,
  ShieldCheck,
  Users,
  Search,
  GraduationCap,
  Eye,
  Star,
  Home,
  Building2,
  UserPlus,
  Scale,
  type LucideIcon,
} from "lucide-react";

export const engagementIcons = {
  consult: MessageSquare,
  proprietary: Lock,
  task: Code2,
  competition: Trophy,
} as const satisfies Record<string, LucideIcon>;

export const navIcons = {
  home: Home,
  forClients: Building2,
  forTalent: GraduationCap,
  browseTalent: Search,
  competitions: Trophy,
  trust: ShieldCheck,
  apply: UserPlus,
} as const;

export const trustIcons = {
  verified: BadgeCheck,
  vetting: ShieldCheck,
  network: Users,
  reputation: Star,
  visibility: Eye,
  legal: Scale,
} as const;
