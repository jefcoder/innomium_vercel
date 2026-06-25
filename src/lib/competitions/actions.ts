"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/profiles/queries";
export async function publishCompetition(competitionId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("competitions")
    .update({ status: "published" })
    .eq("id", competitionId)
    .select("client_profile_id, title")
    .single();

  revalidatePath("/competitions");
  revalidatePath("/admin/competitions");
  return { success: true, data };
}

export async function registerForCompetition(competitionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!talent) return { error: "Verified talent required" };

  await supabase.from("competition_participants").insert({
    competition_id: competitionId,
    talent_profile_id: talent.id,
    status: "registered",
  });

  revalidatePath(`/competitions/${competitionId}`);
  revalidatePath("/talent/competitions");
  return { success: true };
}

export async function submitCompetitionEntry(
  competitionId: string,
  submissionUrl: string,
  notes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: participant } = await supabase
    .from("competition_participants")
    .select("id")
    .eq("competition_id", competitionId)
    .eq("talent_profile_id", talent!.id)
    .single();

  if (!participant) return { error: "Register first" };

  await supabase.from("competition_submissions").insert({
    competition_id: competitionId,
    participant_id: participant.id,
    submission_url: submissionUrl,
    submission_notes: notes,
    status: "submitted",
  });

  revalidatePath("/talent/competitions");
  return { success: true };
}

export async function finalizeLeaderboard(competitionId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("competition_submissions")
    .select("*, competition_participants(id)")
    .eq("competition_id", competitionId)
    .not("score", "is", null)
    .order("score", { ascending: false });

  if (!submissions) return { error: "No scored submissions" };

  await supabase.from("leaderboard_entries").delete().eq("competition_id", competitionId);

  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    await supabase.from("leaderboard_entries").insert({
      competition_id: competitionId,
      participant_id: (sub.competition_participants as { id: string }).id,
      rank: i + 1,
      score: sub.score,
      finalized: true,
    });
  }

  await supabase
    .from("competitions")
    .update({ status: "finalized" })
    .eq("id", competitionId);

  revalidatePath(`/competitions/${competitionId}`);
  revalidatePath("/admin/competitions");
  return { success: true };
}

export async function scoreSubmission(submissionId: string, score: number, notes?: string) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("competition_submissions")
    .update({ score, judge_notes: notes })
    .eq("id", submissionId);

  revalidatePath("/admin/competitions");
  return { success: true };
}

export async function createCompetition(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: cp } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data } = await supabase
    .from("competitions")
    .insert({
      client_profile_id: cp!.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      domain: formData.get("domain") as string,
      reward_model: formData.get("rewardModel") as string || "final_score",
      prize_pool_cents: formData.get("prizePool")
        ? Math.round(parseFloat(formData.get("prizePool") as string) * 100)
        : null,
      rules: formData.get("rules") as string,
      evaluation_method: formData.get("evaluationMethod") as string,
      starts_at: formData.get("startsAt") as string || null,
      ends_at: formData.get("endsAt") as string || null,
      status: "under_review",
    })
    .select()
    .single();

  revalidatePath("/client/competitions");
  return { success: true, id: data?.id };
}
