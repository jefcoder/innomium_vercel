import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { clientNav } from "@/lib/navigation/dashboard";
import { requireProfile } from "@/lib/profiles/queries";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (profile.account_type !== "client" && profile.account_type !== "admin") {
    redirect("/");
  }

  return (
    <DashboardShell user={profile} nav={clientNav} title="Client Dashboard">
      {children}
    </DashboardShell>
  );
}
