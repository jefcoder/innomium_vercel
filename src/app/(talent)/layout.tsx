import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { talentNav } from "@/lib/navigation/dashboard";
import { requireProfile } from "@/lib/profiles/queries";
import { canAccessRoute, homeForAccountType } from "@/lib/auth/routes";

export default async function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (!canAccessRoute(profile.account_type, "/talent")) {
    redirect(homeForAccountType(profile.account_type));
  }

  return (
    <DashboardShell user={profile} nav={talentNav} title="Talent Dashboard">
      {children}
    </DashboardShell>
  );
}
