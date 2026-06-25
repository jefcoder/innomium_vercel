"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";

async function requireUserId() {
  const profile = await requireProfile();
  return profile.id;
}

export async function updateProfile(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  await supabase
    .from("profiles")
    .update({
      full_name: formData.get("fullName") as string,
      display_name: formData.get("displayName") as string,
      headline: formData.get("headline") as string,
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      timezone: formData.get("timezone") as string,
      website_url: formData.get("websiteUrl") as string,
      linkedin_url: formData.get("linkedinUrl") as string,
      github_url: formData.get("githubUrl") as string,
    })
    .eq("id", userId);

  revalidatePath("/talent/profile");
  revalidatePath("/client/settings");
  revalidatePath("/talent/settings");
}

export async function updateClientProfile(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data: cp } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  const payload = {
    company_name: formData.get("companyName") as string,
    company_website: formData.get("companyWebsite") as string,
    industry: formData.get("industry") as string,
    company_size: formData.get("companySize") as string,
    location: formData.get("location") as string,
    description: formData.get("description") as string,
    primary_contact_name: formData.get("contactName") as string,
    primary_contact_email: formData.get("contactEmail") as string,
  };

  if (cp) {
    await supabase.from("client_profiles").update(payload).eq("id", cp.id);
  } else {
    await supabase.from("client_profiles").insert({ user_id: userId, ...payload });
  }

  revalidatePath("/client/settings");
}

export async function updateTalentAvailability(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  const availability = {
    consulting: formData.get("consulting") === "on",
    proprietary: formData.get("proprietary") === "on",
    tasks: formData.get("tasks") === "on",
    competitions: formData.get("competitions") === "on",
  };

  await supabase
    .from("talent_profiles")
    .update({ availability })
    .eq("user_id", userId);

  revalidatePath("/talent/availability");
}

export async function updateTalentVisibility(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  await supabase
    .from("talent_profiles")
    .update({
      visibility: formData.get("visibility") as string,
      professional_headline: formData.get("headline") as string,
      hourly_rate_cents: formData.get("hourlyRate")
        ? Math.round(parseFloat(formData.get("hourlyRate") as string) * 100)
        : null,
    })
    .eq("user_id", userId);

  revalidatePath("/talent/profile");
}
