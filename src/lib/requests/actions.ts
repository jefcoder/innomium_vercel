"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";
import { createNotification } from "@/lib/notifications/actions";

async function getClientProfileId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!data) {
    const { data: created } = await supabase
      .from("client_profiles")
      .insert({ user_id: userId })
      .select()
      .single();
    return created!.id;
  }
  return data.id;
}

export async function createClientRequest(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const clientProfileId = await getClientProfileId(profile.id);

  const requestType = formData.get("requestType") as string;
  const status = formData.get("publish") === "true" ? "submitted" : "draft";

  const { data: request } = await supabase
    .from("client_requests")
    .insert({
      client_profile_id: clientProfileId,
      request_type: requestType,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      domain: formData.get("domain") as string,
      visibility: formData.get("visibility") as string,
      timing_type: formData.get("timingType") as string,
      payment_model: formData.get("paymentModel") as string,
      budget_cents: formData.get("budget")
        ? Math.round(parseFloat(formData.get("budget") as string) * 100)
        : null,
      match_preference: formData.get("matchPreference") as string,
      status,
    })
    .select()
    .single();

  if (!request) return { error: "Failed to create request" };

  if (requestType === "consult") {
    await supabase.from("consult_requests").insert({
      client_request_id: request.id,
      consult_type: formData.get("consultType") as string || "mentor",
      duration_minutes: parseInt(formData.get("duration") as string) || 60,
    });
  } else if (requestType === "proprietary") {
    await supabase.from("proprietary_consult_requests").insert({
      client_request_id: request.id,
      client_anonymity: formData.get("clientAnonymity") as string || "anonymous",
      talent_anonymity: formData.get("talentAnonymity") as string || "anonymous",
    });
  } else if (requestType === "task") {
    await supabase.from("task_requests").insert({
      client_request_id: request.id,
      task_type: formData.get("taskType") as string,
      payment_type: formData.get("paymentModel") as string,
      lifecycle_status: status === "submitted" ? "published" : "draft",
    });
  } else if (requestType === "competition") {
    await supabase.from("competitions").insert({
      client_profile_id: clientProfileId,
      client_request_id: request.id,
      title: request.title,
      description: request.description,
      domain: request.domain,
      reward_model: formData.get("paymentModel") as string || "final_score",
      prize_pool_cents: request.budget_cents,
      status: "under_review",
    });
  }

  if (status === "submitted") {
    await createNotification(
      profile.id,
      "Request Submitted",
      `Your ${requestType} request "${request.title}" is under review.`,
      `/client/requests/${request.id}`
    );
  }

  revalidatePath("/client/requests");
  return { success: true, requestId: request.id };
}

export async function respondToInvitation(
  invitationId: string,
  status: "accepted" | "declined",
  notes?: string
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id")
    .eq("user_id", profile.id)
    .single();

  if (!talent) return { error: "Not a verified talent" };

  await supabase
    .from("request_invitations")
    .update({ status, response_notes: notes })
    .eq("id", invitationId)
    .eq("talent_profile_id", talent.id);

  revalidatePath("/talent/opportunities");
  return { success: true };
}

export async function acceptNda(proprietaryConsultId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("nda_agreements").insert({
    proprietary_consult_id: proprietaryConsultId,
    user_id: profile.id,
  });

  await supabase
    .from("proprietary_consult_requests")
    .update({ disclosure_stage: "post_nda" })
    .eq("id", proprietaryConsultId);

  revalidatePath("/client/proprietary-consults");
  revalidatePath("/talent/consults");
  return { success: true };
}

export async function runConflictCheck(proprietaryConsultId: string, talentProfileId: string) {
  const supabase = await createClient();

  await supabase.from("conflict_checks").insert({
    proprietary_consult_id: proprietaryConsultId,
    talent_profile_id: talentProfileId,
    status: "clear",
  });

  return { success: true };
}

export async function submitTaskWork(taskId: string, notes: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id")
    .eq("user_id", profile.id)
    .single();

  await supabase
    .from("task_requests")
    .update({ lifecycle_status: "submitted" })
    .eq("id", taskId)
    .eq("assigned_talent_id", talent?.id);

  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath("/talent/tasks");
  return { success: true, notes };
}

export async function addMilestone(formData: FormData) {
  await requireProfile();
  const supabase = await createClient();

  await supabase.from("task_milestones").insert({
    task_request_id: formData.get("taskId") as string,
    title: formData.get("title") as string,
    deliverable: formData.get("deliverable") as string,
    amount_cents: Math.round(parseFloat(formData.get("amount") as string) * 100),
    acceptance_criteria: formData.get("criteria") as string,
    due_at: formData.get("dueAt") as string || null,
  });

  revalidatePath(`/client/tasks/${formData.get("taskId")}`);
  return { success: true };
}

export async function logTime(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id")
    .eq("user_id", profile.id)
    .single();

  await supabase.from("time_logs").insert({
    task_request_id: formData.get("taskId") as string,
    talent_profile_id: talent!.id,
    hours: parseFloat(formData.get("hours") as string),
    description: formData.get("description") as string,
  });

  revalidatePath("/talent/tasks");
  return { success: true };
}
