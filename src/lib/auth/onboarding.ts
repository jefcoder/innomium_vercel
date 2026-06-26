import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/** User is signed in but has not finished signup / account-type setup. */
export async function userNeedsOnboarding(
  supabase: SupabaseClient,
  user: User
): Promise<boolean> {
  if (user.user_metadata?.signup_completed === true) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    return !profile;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  // Legacy accounts that predate signup_completed.
  if (profile) return false;

  return true;
}
