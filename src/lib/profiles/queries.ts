import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeAccountType } from "@/lib/auth/routes";
import type { AccountType, Profile } from "./types";

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

async function ensureRoleRecords(
  supabase: SupabaseClient,
  userId: string,
  accountType: AccountType
) {
  if (accountType === "client") {
    await supabase.from("client_profiles").upsert({ user_id: userId });
  }
  if (accountType === "talent_applicant" || accountType === "talent") {
    await supabase.from("talent_applications").upsert({ user_id: userId });
  }
}

export async function ensureProfile(user: User): Promise<Profile | null> {
  const supabase = await createClient();
  const meta = user.user_metadata ?? {};

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    console.error("ensureProfile: failed to read profile", readError.message);
    return null;
  }

  if (existing) {
    const normalized = normalizeAccountType(existing.account_type);
    let profile = { ...existing, account_type: normalized } as Profile;

    if (existing.account_type !== normalized) {
      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ account_type: normalized })
        .eq("id", user.id)
        .select()
        .maybeSingle();

      if (!updateError && updated) {
        profile = updated as Profile;
      }
    }

    await ensureRoleRecords(supabase, user.id, profile.account_type);
    return profile;
  }

  if (meta.signup_completed !== true) {
    return null;
  }

  const accountType = normalizeAccountType(meta.account_type as string | undefined);
  const payload = {
    id: user.id,
    full_name: (meta.full_name || meta.name || null) as string | null,
    display_name: (meta.display_name || meta.name || null) as string | null,
    avatar_url: (meta.avatar_url || meta.picture || null) as string | null,
    account_type: accountType,
  };

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();

  if (insertError || !created) {
    const { data: refetched } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (refetched) {
      const accountType = normalizeAccountType(refetched.account_type);
      await ensureRoleRecords(supabase, user.id, accountType);
      return { ...refetched, account_type: accountType } as Profile;
    }

    console.error("ensureProfile: failed to create profile", insertError?.message);
    return null;
  }

  await ensureRoleRecords(supabase, user.id, accountType);
  return created as Profile;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireProfile();
  if (normalizeAccountType(profile.account_type) !== "admin") throw new Error("Forbidden");
  return profile;
}
