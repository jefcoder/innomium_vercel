import { createClient } from "@/lib/supabase/server";
import type { Competition } from "@/lib/profiles/types";

export async function listPublicCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .in("status", ["published", "registration_open", "active"])
    .order("starts_at", { ascending: true });
  return (data ?? []) as Competition[];
}

export async function getCompetitionById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("competitions").select("*").eq("id", id).single();
  return data as Competition | null;
}

export async function getLeaderboard(competitionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leaderboard_entries")
    .select("*, competition_participants(talent_profile_id)")
    .eq("competition_id", competitionId)
    .order("rank", { ascending: true });
  return data ?? [];
}

export async function getLiveDailyScores(competitionId: string, date?: string) {
  const supabase = await createClient();
  const scoreDate = date ?? new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("competition_daily_scores")
    .select("*, competition_participants(talent_profile_id)")
    .eq("competition_id", competitionId)
    .eq("score_date", scoreDate)
    .order("score", { ascending: false });
  return data ?? [];
}
