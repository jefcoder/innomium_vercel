import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { TalentCompetitionPanel } from "@/components/competitions/TalentCompetitionPanel";
import { Badge } from "@/components/ui/Badge";

export default async function TalentCompetitionDetailPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competitionId)
    .single();

  if (!competition) notFound();

  const { data: participant } = await supabase
    .from("competition_participants")
    .select("id")
    .eq("competition_id", competitionId)
    .eq("talent_profile_id", talentProfile?.id ?? "")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/talent/competitions" className="text-sm text-brand hover:underline">
          ← Back to competitions
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{competition.title}</h1>
        <Badge variant="brand" className="mt-2">
          {competition.status}
        </Badge>
      </div>

      <TalentCompetitionPanel
        competitionId={competitionId}
        rewardModel={competition.reward_model}
        isRegistered={!!participant}
      />
    </div>
  );
}
