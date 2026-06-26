import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientCompetitionDetailPage({
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

  const { data: participants } = await supabase
    .from("competition_participants")
    .select("id, status, created_at, talent_profiles(professional_headline)")
    .eq("competition_id", competitionId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/client/competitions" className="text-sm text-brand hover:underline">
          ← Back to competitions
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{competition.title}</h1>
        <Badge variant="brand" className="mt-2">
          {competition.status}
        </Badge>
      </div>

      <div className="card-surface space-y-3 p-6 text-sm">
        {competition.description && <p className="text-text-muted">{competition.description}</p>}
        {competition.prize_pool_cents != null && (
          <p>Prize pool: {formatCurrency(competition.prize_pool_cents)}</p>
        )}
        {competition.daily_budget_cents != null && (
          <p>Daily budget: {formatCurrency(competition.daily_budget_cents)}</p>
        )}
        <p>Reward model: {competition.reward_model}</p>
        {competition.ends_at && <p>Ends: {formatDate(competition.ends_at)}</p>}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Participants</h2>
        {!participants?.length ? (
          <p className="text-sm text-text-muted">No participants yet.</p>
        ) : (
          <ul className="space-y-2">
            {participants.map((p) => {
              const talentRaw = p.talent_profiles;
              const talent = (Array.isArray(talentRaw) ? talentRaw[0] : talentRaw) as {
                professional_headline: string | null;
              } | null;
              return (
                <li key={p.id} className="card-surface flex justify-between p-3 text-sm">
                  <span>{talent?.professional_headline ?? "Talent"}</span>
                  <Badge variant="muted">{p.status}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
