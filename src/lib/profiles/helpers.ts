import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";

export async function getClientProfile() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single();
  return data;
}

export async function getTalentProfile() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("talent_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single();
  return data;
}

export async function getTalentApplication() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("talent_applications")
    .select("*")
    .eq("user_id", profile.id)
    .single();
  return data;
}
