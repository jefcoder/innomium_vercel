import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { talentNav } from "@/lib/navigation/dashboard";
import { requireProfile } from "@/lib/profiles/queries";

export default async function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  if (!["talent", "talent_applicant", "admin"].includes(profile.account_type)) {
    redirect("/");
  }

  return (
    <DashboardShell user={profile} nav={talentNav} title="Talent Dashboard">
      {children}
    </DashboardShell>
  );
}
