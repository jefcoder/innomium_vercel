import { notFound } from "next/navigation";
import { Trophy, Calendar } from "lucide-react";
import { getCompetitionById, getLeaderboard } from "@/lib/competitions/queries";
import { getCurrentProfile } from "@/lib/profiles/queries";
import { CompetitionRegisterButton } from "@/components/competitions/CompetitionRegisterButton";
import { LiveLeaderboard } from "@/components/competitions/LiveLeaderboard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const c = await getCompetitionById(competitionId);
  return { title: c?.title ?? "Competition" };
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const [competition, leaderboard, profile] = await Promise.all([
    getCompetitionById(competitionId),
    getLeaderboard(competitionId),
    getCurrentProfile(),
  ]);

  if (!competition) notFound();

  const isTalent = profile?.account_type === "talent";

  return (
    <div className="section-container py-16 md:py-24">
      <div className="card-surface p-8">
        <div className="flex items-start gap-4">
          <Trophy size={28} className="text-brand" />
          <div className="flex-1">
            <Badge variant="brand">{competition.status.replace(/_/g, " ")}</Badge>
            <h1 className="mt-2 text-2xl font-bold text-text">{competition.title}</h1>
            {competition.description && (
              <p className="mt-4 text-text-body">{competition.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
              {competition.domain && <span>{competition.domain}</span>}
              {competition.prize_pool_cents != null && (
                <span>Prize: {formatCurrency(competition.prize_pool_cents)}</span>
              )}
              {competition.ends_at && (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  Ends {formatDate(competition.ends_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {competition.rules && (
          <div className="mt-8">
            <h2 className="font-semibold text-text">Rules</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{competition.rules}</p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <CompetitionRegisterButton competitionId={competitionId} isTalent={isTalent} />
          <Button href="/competitions" variant="outline">
            All Competitions
          </Button>
        </div>
      </div>

      <LiveLeaderboard competitionId={competitionId} initialEntries={leaderboard} />
    </div>
  );
}
