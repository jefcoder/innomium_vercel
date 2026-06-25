import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: applicationsCount },
    { count: requestsCount },
    { count: competitionsCount },
    { count: reportsCount },
  ] = await Promise.all([
    supabase.from("talent_applications").select("*", { count: "exact", head: true }),
    supabase.from("client_requests").select("*", { count: "exact", head: true }),
    supabase.from("competitions").select("*", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "submitted"),
  ]);

  const stats = [
    { label: "Applications", value: applicationsCount ?? 0, href: "/admin/talent-applications" },
    { label: "Client requests", value: requestsCount ?? 0, href: "/admin/client-requests" },
    { label: "Competitions", value: competitionsCount ?? 0, href: "/admin/competitions" },
    { label: "Open reports", value: reportsCount ?? 0, href: "/admin/reports" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Admin overview</h1>
        <p className="mt-1 text-sm text-text-muted">Platform operations and moderation.</p>
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
