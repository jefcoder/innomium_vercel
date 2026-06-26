import { createClient } from "@/lib/supabase/server";

export async function listMatchableRequests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_requests")
    .select("id, title, request_type, status, domain, summary")
    .in("status", ["submitted", "under_review", "published", "active"])
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function listMatchableTalents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("talent_profiles")
    .select("id, professional_headline, visibility, profiles(full_name, display_name)")
    .not("verified_at", "is", null)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function listRecentInvitations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("request_invitations")
    .select("*, client_requests(title, request_type), talent_profiles(professional_headline)")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}
