import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { adminNav } from "@/lib/navigation/dashboard";
import { requireAdmin } from "@/lib/profiles/queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile;
  try {
    profile = await requireAdmin();
  } catch {
    redirect("/");
  }

  return (
    <DashboardShell user={profile} nav={adminNav} title="Admin Dashboard">
      {children}
    </DashboardShell>
  );
}
