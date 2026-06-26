export type DashboardIcon =
  | "layoutDashboard"
  | "fileText"
  | "messageSquare"
  | "lock"
  | "code2"
  | "trophy"
  | "users"
  | "creditCard"
  | "settings"
  | "user"
  | "badgeCheck"
  | "calendar"
  | "briefcase"
  | "dollarSign"
  | "star"
  | "shield"
  | "gitMerge"
  | "alertTriangle"
  | "clipboardList";

export interface NavItem {
  label: string;
  href: string;
  icon: DashboardIcon;
}

export const clientNav: NavItem[] = [
  { label: "Overview", href: "/client", icon: "layoutDashboard" },
  { label: "Requests", href: "/client/requests", icon: "fileText" },
  { label: "Consults", href: "/client/consults", icon: "messageSquare" },
  { label: "Proprietary", href: "/client/proprietary-consults", icon: "lock" },
  { label: "Tasks", href: "/client/tasks", icon: "code2" },
  { label: "Competitions", href: "/client/competitions", icon: "trophy" },
  { label: "Talents", href: "/client/talents", icon: "users" },
  { label: "Messages", href: "/client/messages", icon: "messageSquare" },
  { label: "Payments", href: "/client/payments", icon: "creditCard" },
  { label: "Settings", href: "/client/settings", icon: "settings" },
];

export const talentNav: NavItem[] = [
  { label: "Overview", href: "/talent", icon: "layoutDashboard" },
  { label: "Profile", href: "/talent/profile", icon: "user" },
  { label: "Skills", href: "/talent/skills", icon: "badgeCheck" },
  { label: "Availability", href: "/talent/availability", icon: "calendar" },
  { label: "Opportunities", href: "/talent/opportunities", icon: "briefcase" },
  { label: "Consults", href: "/talent/consults", icon: "messageSquare" },
  { label: "Tasks", href: "/talent/tasks", icon: "code2" },
  { label: "Competitions", href: "/talent/competitions", icon: "trophy" },
  { label: "Earnings", href: "/talent/earnings", icon: "dollarSign" },
  { label: "Reputation", href: "/talent/reputation", icon: "star" },
  { label: "Messages", href: "/talent/messages", icon: "messageSquare" },
  { label: "Settings", href: "/talent/settings", icon: "settings" },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "layoutDashboard" },
  { label: "Applications", href: "/admin/talent-applications", icon: "clipboardList" },
  { label: "Skill Verification", href: "/admin/skill-verification", icon: "badgeCheck" },
  { label: "Client Requests", href: "/admin/client-requests", icon: "fileText" },
  { label: "Matching", href: "/admin/matching", icon: "gitMerge" },
  { label: "Competitions", href: "/admin/competitions", icon: "trophy" },
  { label: "Disputes", href: "/admin/disputes", icon: "alertTriangle" },
  { label: "Reports", href: "/admin/reports", icon: "shield" },
  { label: "Payments", href: "/admin/payments", icon: "creditCard" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
