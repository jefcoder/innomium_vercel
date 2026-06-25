import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function TalentCompetitionsPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: participants } = await supabase
    .from("competition_participants")
    .select("*, competitions(title, status, ends_at)")
    .eq("talent_profile_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Competitions</h1>

      {!participants?.length ? (
        <EmptyState
          title="No competitions"
          description="Registered competitions will appear here."
          action={
            <Link href="/competitions" className="text-sm font-semibold text-brand hover:underline">
              Browse public competitions
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {participants.map((participant) => {
            const competition = participant.competitions as {
              title: string;
              status: string;
              ends_at: string | null;
            };
            return (
              <li key={participant.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{competition.title}</p>
                  <p className="text-sm text-text-muted">
                    {participant.status} · {formatDate(participant.created_at)}
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
