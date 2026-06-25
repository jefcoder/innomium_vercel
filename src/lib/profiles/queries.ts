import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { Profile, AccountType } from "./types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return ensureProfile(user);
}

export async function ensureProfile(user: User): Promise<Profile> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) return existing as Profile;

  const meta = user.user_metadata ?? {};
  const accountType = (meta.account_type as AccountType) || "client";

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      full_name: meta.full_name || meta.name || null,
      display_name: meta.display_name || meta.name || null,
      avatar_url: meta.avatar_url || meta.picture || null,
      account_type: accountType,
    })
    .select()
    .single();

  if (error) throw error;

  if (accountType === "client") {
    await supabase.from("client_profiles").upsert({ user_id: user.id });
  }

  if (accountType === "talent_applicant") {
    await supabase.from("talent_applications").upsert({ user_id: user.id });
  }

  return created as Profile;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireProfile();
  if (profile.account_type !== "admin") throw new Error("Forbidden");
  return profile;
}
