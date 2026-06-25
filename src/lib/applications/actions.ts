"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile, requireAdmin } from "@/lib/profiles/queries";
import { createNotification } from "@/lib/notifications/actions";

export async function submitTalentApplication(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const engagementTypes = formData.getAll("engagementTypes") as string[];
  const visibility = formData.get("visibility") as string;

  await supabase
    .from("profiles")
    .update({
      full_name: formData.get("fullName") as string,
      location: formData.get("location") as string,
      timezone: formData.get("timezone") as string,
      linkedin_url: formData.get("linkedin") as string,
      github_url: formData.get("github") as string,
      website_url: formData.get("website") as string,
    })
    .eq("id", profile.id);

  const { data: app } = await supabase
    .from("talent_applications")
    .upsert({
      user_id: profile.id,
      status: "submitted",
      engagement_types: engagementTypes,
      visibility_preference: visibility,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  const skillIds = formData.getAll("skillIds") as string[];
  const applicationId = app?.id;

  if (applicationId) {
    for (const skillId of skillIds) {
      const level = parseInt(formData.get(`level_${skillId}`) as string) || 2;
      const explanation = formData.get(`explanation_${skillId}`) as string;
      const evidenceUrl = formData.get(`evidence_${skillId}`) as string;

      const { data: claim } = await supabase
        .from("skill_claims")
        .insert({
          application_id: applicationId,
          skill_id: skillId,
          level,
          explanation,
          status: "pending",
        })
        .select()
        .single();

      if (claim && evidenceUrl) {
        await supabase.from("skill_evidence").insert({
          skill_claim_id: claim.id,
          evidence_type: "url",
          url: evidenceUrl,
          title: "Supporting evidence",
        });
      }
    }
  }

  await supabase
    .from("profiles")
    .update({ account_type: "talent_applicant" })
    .eq("id", profile.id);

  revalidatePath("/apply");
  revalidatePath("/admin/talent-applications");
  return { success: true };
}

export async function reviewTalentApplication(
  applicationId: string,
  action: "approve" | "reject" | "more_info",
  notes?: string
) {
  await requireAdmin();
  const supabase = await createClient();

  const statusMap = {
    approve: "approved",
    reject: "rejected",
    more_info: "more_info_needed",
  } as const;

  const { data: app } = await supabase
    .from("talent_applications")
    .update({
      status: statusMap[action],
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select("user_id, visibility_preference")
    .single();

  if (action === "approve" && app) {
    await supabase
      .from("profiles")
      .update({ account_type: "talent" })
      .eq("id", app.user_id);

    const { data: existing } = await supabase
      .from("talent_profiles")
      .select("id")
      .eq("user_id", app.user_id)
      .single();

    let talentProfileId = existing?.id;

    if (!existing) {
      const { data: tp } = await supabase
        .from("talent_profiles")
        .insert({
          user_id: app.user_id,
          application_id: applicationId,
          visibility: app.visibility_preference,
          verified_at: new Date().toISOString(),
        })
        .select()
        .single();
      talentProfileId = tp?.id;
    } else {
      await supabase
        .from("talent_profiles")
        .update({ verified_at: new Date().toISOString(), visibility: app.visibility_preference })
        .eq("id", existing.id);
    }

    if (talentProfileId) {
      await supabase
        .from("skill_claims")
        .update({ talent_profile_id: talentProfileId })
        .eq("application_id", applicationId);
    }

    await createNotification(app.user_id, "Application Approved", "Your talent application has been approved.", "/talent");
  } else if (app) {
    await createNotification(
      app.user_id,
      "Application Update",
      notes ?? `Your application status: ${statusMap[action]}`,
      "/apply"
    );
  }

  revalidatePath("/admin/talent-applications");
  revalidatePath(`/admin/talent-applications/${applicationId}`);
  return { success: true };
}

export async function verifySkillClaim(
  claimId: string,
  outcome: "verified" | "rejected" | "partial",
  notes?: string
) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  await supabase.from("skill_verifications").insert({
    skill_claim_id: claimId,
    reviewer_id: admin.id,
    outcome,
    notes,
  });

  await supabase.from("skill_claims").update({ status: outcome }).eq("id", claimId);

  revalidatePath("/admin/skill-verification");
  return { success: true };
}
