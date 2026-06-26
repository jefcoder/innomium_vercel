"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireAdmin } from "@/lib/profiles/queries";
import { createNotification } from "@/lib/notifications/actions";
import { createThread } from "@/lib/messaging/actions";

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

export async function inviteTalentToRequest(
  requestId: string,
  talentProfileId: string,
  notes?: string
) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("client_requests")
    .select("id, title, request_type, client_profile_id, status")
    .eq("id", requestId)
    .single();

  if (!request) return { error: "Request not found" };

  const { data: talent } = await supabase
    .from("talent_profiles")
    .select("id, user_id")
    .eq("id", talentProfileId)
    .single();

  if (!talent) return { error: "Talent not found" };

  const { error } = await supabase.from("request_invitations").insert({
    client_request_id: requestId,
    talent_profile_id: talentProfileId,
    status: "pending",
    response_notes: notes ?? null,
  });

  if (error) {
    if (error.code === "23505") return { error: "Talent already invited" };
    return { error: error.message };
  }

  if (request.status === "submitted" || request.status === "under_review") {
    await supabase
      .from("client_requests")
      .update({ status: "published" })
      .eq("id", requestId);
  }

  await createNotification(
    talent.user_id,
    "New Opportunity",
    `You've been invited to "${request.title}"`,
    "/talent/opportunities"
  );

  revalidatePath("/admin/matching");
  revalidatePath("/talent/opportunities");
  return { success: true };
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

  const { data: invitation } = await supabase
    .from("request_invitations")
    .select("*, client_requests(id, title, request_type, client_profile_id)")
    .eq("id", invitationId)
    .eq("talent_profile_id", talent.id)
    .single();

  if (!invitation) return { error: "Invitation not found" };

  await supabase
    .from("request_invitations")
    .update({ status, response_notes: notes })
    .eq("id", invitationId)
    .eq("talent_profile_id", talent.id);

  if (status === "accepted") {
    const request = invitation.client_requests as {
      id: string;
      title: string;
      request_type: string;
      client_profile_id: string;
    };

    const { data: clientProfile } = await supabase
      .from("client_profiles")
      .select("user_id")
      .eq("id", request.client_profile_id)
      .single();

    if (request.request_type === "task") {
      await supabase
        .from("task_requests")
        .update({
          assigned_talent_id: talent.id,
          lifecycle_status: "talent_accepted",
        })
        .eq("client_request_id", request.id);
    } else if (request.request_type === "consult") {
      await supabase
        .from("consult_requests")
        .update({
          selected_talent_id: talent.id,
          lifecycle_status: "talent_selected",
        })
        .eq("client_request_id", request.id);
    } else if (request.request_type === "proprietary") {
      await supabase
        .from("proprietary_consult_requests")
        .update({ lifecycle_status: "matching" })
        .eq("client_request_id", request.id);
    }

    await supabase.from("contracts").insert({
      client_profile_id: request.client_profile_id,
      talent_profile_id: talent.id,
      reference_type: request.request_type,
      reference_id: request.id,
      status: "active",
    });

    if (clientProfile?.user_id) {
      await createThread(
        [clientProfile.user_id],
        request.title,
        request.request_type,
        request.id,
        `Talent accepted invitation for "${request.title}".`
      );
      await createNotification(
        clientProfile.user_id,
        "Invitation Accepted",
        `A talent accepted your request "${request.title}"`,
        `/client/requests/${request.id}`
      );
    }

    await supabase
      .from("client_requests")
      .update({ status: "active" })
      .eq("id", request.id);
  }

  revalidatePath("/talent/opportunities");
  revalidatePath("/client/requests");
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

export async function approveMilestone(milestoneId: string, taskId: string) {
  await requireProfile();
  const supabase = await createClient();

  await supabase
    .from("task_milestones")
    .update({ status: "approved" })
    .eq("id", milestoneId);

  revalidatePath(`/client/tasks/${taskId}`);
  return { success: true };
}

export async function markTaskComplete(taskId: string) {
  await requireProfile();
  const supabase = await createClient();

  await supabase
    .from("task_requests")
    .update({ lifecycle_status: "completed" })
    .eq("id", taskId);

  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath("/talent/tasks");
  return { success: true };
}

export async function openTaskDispute(taskId: string, reason: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("task_requests")
    .select("assigned_talent_id")
    .eq("id", taskId)
    .single();

  await supabase
    .from("task_requests")
    .update({ lifecycle_status: "disputed" })
    .eq("id", taskId);

  const { data: talent } = task?.assigned_talent_id
    ? await supabase
        .from("talent_profiles")
        .select("user_id")
        .eq("id", task.assigned_talent_id)
        .single()
    : { data: null };

  await supabase.from("reports").insert({
    reporter_id: profile.id,
    reported_id: talent?.user_id ?? profile.id,
    category: "task_dispute",
    description: reason,
    reference_type: "task",
    reference_id: taskId,
    status: "submitted",
  });

  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath("/admin/disputes");
  return { success: true };
}

export async function resolveTaskDispute(
  taskId: string,
  resolution: "completed" | "revision_requested" | "closed",
  adminNotes?: string
) {
  await requireAdmin();
  const supabase = await createClient();
  const admin = await requireProfile();

  await supabase
    .from("task_requests")
    .update({ lifecycle_status: resolution })
    .eq("id", taskId);

  if (adminNotes) {
    await supabase.from("admin_notes").insert({
      admin_id: admin.id,
      target_type: "task_dispute",
      target_id: taskId,
      note: adminNotes,
    });
  }

  revalidatePath("/admin/disputes");
  revalidatePath(`/client/tasks/${taskId}`);
  return { success: true };
}
