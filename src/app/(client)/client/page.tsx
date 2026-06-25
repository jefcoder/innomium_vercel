import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { Button } from "@/components/ui/Button";

export default async function ClientOverviewPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const profileId = clientProfile?.id;
  const [
    { count: requestsCount },
    { count: consultsCount },
    { count: tasksCount },
    { count: competitionsCount },
  ] = await Promise.all([
    supabase
      .from("client_requests")
      .select("*", { count: "exact", head: true })
      .eq("client_profile_id", profileId ?? ""),
    supabase
      .from("consult_requests")
      .select("*, client_requests!inner(client_profile_id)", { count: "exact", head: true })
      .eq("client_requests.client_profile_id", profileId ?? ""),
    supabase
      .from("task_requests")
      .select("*, client_requests!inner(client_profile_id)", { count: "exact", head: true })
      .eq("client_requests.client_profile_id", profileId ?? ""),
    supabase
      .from("competitions")
      .select("*", { count: "exact", head: true })
      .eq("client_profile_id", profileId ?? ""),
  ]);

  const stats = [
    { label: "Requests", value: requestsCount ?? 0, href: "/client/requests" },
    { label: "Consults", value: consultsCount ?? 0, href: "/client/consults" },
    { label: "Tasks", value: tasksCount ?? 0, href: "/client/tasks" },
    { label: "Competitions", value: competitionsCount ?? 0, href: "/client/competitions" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Overview</h1>
          <p className="mt-1 text-sm text-text-muted">
            Track requests, engagements, and competitions in one place.
          </p>
        </div>
        <Button href="/client/requests/new">New request</Button>
      </div>

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
