import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { clientNav } from "@/lib/navigation/dashboard";
import { requireProfile } from "@/lib/profiles/queries";
import { canAccessRoute, homeForAccountType } from "@/lib/auth/routes";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (!canAccessRoute(profile.account_type, "/client")) {
    redirect(homeForAccountType(profile.account_type));
  }

  return (
    <DashboardShell user={profile} nav={clientNav} title="Client Dashboard">
      {children}
    </DashboardShell>
  );
}
