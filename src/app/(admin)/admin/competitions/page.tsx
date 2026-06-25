import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminCompetitionsPage() {
  const supabase = await createClient();

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*, client_profiles(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Competitions</h1>

      {!competitions?.length ? (
        <EmptyState title="No competitions" description="Platform competitions will appear here." />
      ) : (
        <ul className="space-y-3">
          {competitions.map((competition) => {
            const client = competition.client_profiles as { company_name: string | null } | null;
            return (
              <li key={competition.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-text">{competition.title}</p>
                  <p className="text-sm text-text-muted">
                    {client?.company_name ?? "Client"} ·{" "}
                    {competition.prize_pool_cents
                      ? formatCurrency(competition.prize_pool_cents)
                      : "Prize TBD"}{" "}
                    · {formatDate(competition.created_at)}
                  </p>
                </div>
                <Badge variant="brand">{competition.status}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
