import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminTalentApplicationsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("talent_applications")
    .select("*, profiles(full_name, display_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Talent applications</h1>

      {!applications?.length ? (
        <EmptyState title="No applications" description="Incoming talent applications will appear here." />
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => {
            const profile = app.profiles as { full_name: string | null; display_name: string | null } | null;
            return (
              <li key={app.id}>
                <Link
                  href={`/admin/talent-applications/${app.id}`}
                  className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-text">
                      {profile?.display_name ?? profile?.full_name ?? "Applicant"}
                    </p>
                    <p className="text-sm text-text-muted">{formatDate(app.created_at)}</p>
                  </div>
                  <Badge variant={app.status === "approved" ? "success" : "muted"}>
                    {app.status}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
