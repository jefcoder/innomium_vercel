import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";
import { normalizeAccountType } from "@/lib/auth/routes";
import type { AccountType } from "@/lib/profiles/types";

async function ensureRoleRecords(userId: string, accountType: AccountType) {
  const supabase = await createClient();
  if (accountType === "client") {
    await supabase.from("client_profiles").upsert({ user_id: userId });
  }
  if (accountType === "talent_applicant" || accountType === "talent") {
    await supabase.from("talent_applications").upsert({ user_id: userId });
  }
}

export async function getClientProfile() {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (normalizeAccountType(profile.account_type) === "client") {
    await ensureRoleRecords(profile.id, "client");
  }

  const { data } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();
  return data;
}

export async function getTalentProfile() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("talent_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();
  return data;
}

export async function getTalentApplication() {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (
    normalizeAccountType(profile.account_type) === "talent_applicant" ||
    normalizeAccountType(profile.account_type) === "talent"
  ) {
    await ensureRoleRecords(profile.id, profile.account_type);
  }

  const { data } = await supabase
    .from("talent_applications")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();
  return data;
}
