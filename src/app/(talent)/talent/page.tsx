import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { Button } from "@/components/ui/Button";

export default async function TalentOverviewPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const talentId = talentProfile?.id;
  const [
    { count: invitationsCount },
    { count: tasksCount },
    { count: competitionsCount },
    { count: payoutsCount },
  ] = await Promise.all([
    supabase
      .from("request_invitations")
      .select("*", { count: "exact", head: true })
      .eq("talent_profile_id", talentId ?? "")
      .eq("status", "pending"),
    supabase
      .from("task_requests")
      .select("*", { count: "exact", head: true })
      .eq("assigned_talent_id", talentId ?? ""),
    supabase
      .from("competition_participants")
      .select("*", { count: "exact", head: true })
      .eq("talent_profile_id", talentId ?? ""),
    supabase
      .from("payouts")
      .select("*", { count: "exact", head: true })
      .eq("talent_profile_id", talentId ?? ""),
  ]);

  const stats = [
    { label: "Pending invitations", value: invitationsCount ?? 0, href: "/talent/opportunities" },
    { label: "Active tasks", value: tasksCount ?? 0, href: "/talent/tasks" },
    { label: "Competitions", value: competitionsCount ?? 0, href: "/talent/competitions" },
    { label: "Payouts", value: payoutsCount ?? 0, href: "/talent/earnings" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Overview</h1>
          <p className="mt-1 text-sm text-text-muted">
            {talentProfile?.professional_headline ?? "Manage your talent dashboard"}
          </p>
        </div>
        <Button href="/talent/profile">Edit profile</Button>
      </div>

      {talentProfile && (
        <div className="card-surface p-5">
          <p className="text-sm text-text-muted">Overall reputation</p>
          <p className="mt-1 text-3xl font-bold text-text">
            {Number(talentProfile.reputation_overall).toFixed(1)}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-surface p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-text">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
