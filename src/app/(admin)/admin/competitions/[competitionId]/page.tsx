import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminCompetitionPanel } from "@/components/competitions/AdminCompetitionPanel";
import { LiveLeaderboard } from "@/components/competitions/LiveLeaderboard";
import { getLeaderboard } from "@/lib/competitions/queries";

export default async function AdminCompetitionDetailPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competitionId)
    .single();

  if (!competition) notFound();

  const { data: submissions } = await supabase
    .from("competition_submissions")
    .select("*")
    .eq("competition_id", competitionId)
    .order("created_at", { ascending: false });

  const leaderboard = await getLeaderboard(competitionId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/competitions" className="text-sm text-brand hover:underline">
          ← Back to competitions
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{competition.title}</h1>
      </div>

      <AdminCompetitionPanel
        competitionId={competitionId}
        status={competition.status}
        submissions={submissions ?? []}
      />

      <LiveLeaderboard competitionId={competitionId} initialEntries={leaderboard} />
    </div>
  );
}
