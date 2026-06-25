import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientCompetitionManagePage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competitionId)
    .eq("client_profile_id", clientProfile?.id ?? "")
    .single();

  if (!competition) notFound();

  const { count: participantCount } = await supabase
    .from("competition_participants")
    .select("*", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/client/competitions" className="text-sm text-brand hover:underline">
          ← Back to competitions
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{competition.title}</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your competition</p>
      </div>

      <div className="card-surface space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="brand">{competition.status}</Badge>
          {competition.prize_pool_cents != null && (
            <Badge variant="success">{formatCurrency(competition.prize_pool_cents)} prize pool</Badge>
          )}
        </div>
        {competition.description && (
          <p className="text-sm text-text-muted">{competition.description}</p>
        )}
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <dt className="text-text-muted">Participants</dt>
          <dd className="text-text">{participantCount ?? 0}</dd>
          {competition.starts_at && (
            <>
              <dt className="text-text-muted">Starts</dt>
              <dd className="text-text">{formatDate(competition.starts_at)}</dd>
            </>
          )}
          {competition.ends_at && (
            <>
              <dt className="text-text-muted">Ends</dt>
              <dd className="text-text">{formatDate(competition.ends_at)}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
