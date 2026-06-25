import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientCompetitionsPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .eq("client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Competitions</h1>
        <Button href="/client/competitions/new">New competition</Button>
      </div>

      {!competitions?.length ? (
        <EmptyState
          title="No competitions"
          description="Launch AI/ML competitions to evaluate and discover talent."
          action={<Button href="/client/competitions/new">Create competition</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {competitions.map((competition) => (
            <li key={competition.id}>
              <Link
                href={`/client/competitions/${competition.id}`}
                className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-text">{competition.title}</p>
                  <p className="text-sm text-text-muted">
                    {competition.prize_pool_cents
                      ? formatCurrency(competition.prize_pool_cents)
                      : "Prize TBD"}{" "}
                    · {formatDate(competition.created_at)}
                  </p>
                </div>
                <Badge variant="brand">{competition.status}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
