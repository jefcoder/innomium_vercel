import type { AccountType } from "@/lib/profiles/types";

/** Legacy agency account type mapped to talent applicant. */
export function normalizeAccountType(
  accountType: string | null | undefined
): AccountType {
  if (!accountType || accountType === "builder") return "talent_applicant";
  if (
    accountType === "client" ||
    accountType === "talent_applicant" ||
    accountType === "talent" ||
    accountType === "admin"
  ) {
    return accountType;
  }
  return "client";
}

export function homeForAccountType(accountType: string | null | undefined): string {
  switch (normalizeAccountType(accountType)) {
    case "admin":
      return "/admin";
    case "talent":
    case "talent_applicant":
      return "/talent";
    case "client":
    default:
      return "/client";
  }
}

export function settingsPathForAccountType(
  accountType: string | null | undefined
): string {
  return `${homeForAccountType(accountType)}/settings`;
}

export function canAccessRoute(
  accountType: string | null | undefined,
  pathname: string
): boolean {
  const role = normalizeAccountType(accountType);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return role === "admin";
  }
  if (pathname === "/client" || pathname.startsWith("/client/")) {
    return role === "client" || role === "admin";
  }
  if (pathname === "/talent" || pathname.startsWith("/talent/")) {
    return role === "talent" || role === "talent_applicant" || role === "admin";
  }
  return true;
}
