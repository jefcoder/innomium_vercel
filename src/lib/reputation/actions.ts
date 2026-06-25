"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireAdmin } from "@/lib/profiles/queries";

export async function submitReview(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("reviews").insert({
    reviewer_id: profile.id,
    reviewee_id: formData.get("revieweeId") as string,
    reference_type: formData.get("referenceType") as string,
    reference_id: formData.get("referenceId") as string,
    rating: parseInt(formData.get("rating") as string),
    comment: formData.get("comment") as string,
    dimension: formData.get("dimension") as string,
  });

  const rating = parseInt(formData.get("rating") as string);
  const dimension = formData.get("dimension") as string;
  const revieweeId = formData.get("revieweeId") as string;

  await supabase.from("reputation_events").insert({
    profile_id: revieweeId,
    event_type: "review",
    dimension,
    delta: rating - 3,
    reference_type: formData.get("referenceType") as string,
    reference_id: formData.get("referenceId") as string,
  });

  revalidatePath("/talent/reputation");
  return { success: true };
}

export async function submitReport(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("reports").insert({
    reporter_id: profile.id,
    reported_id: formData.get("reportedId") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    reference_type: formData.get("referenceType") as string,
    reference_id: formData.get("referenceId") as string,
    status: "submitted",
  });

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function moderateReport(
  reportId: string,
  status: "confirmed" | "dismissed",
  adminNotes?: string
) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .update({ status, admin_notes: adminNotes })
    .eq("id", reportId)
    .select()
    .single();

  if (status === "confirmed" && report) {
    await supabase.from("reputation_events").insert({
      profile_id: report.reported_id,
      event_type: "report_confirmed",
      dimension: "overall",
      delta: -1,
      reference_type: "report",
      reference_id: reportId,
    });
  }

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function getReputationEvents(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reputation_events")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
