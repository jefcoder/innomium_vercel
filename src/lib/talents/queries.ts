import { createClient } from "@/lib/supabase/server";

export interface TalentBrowseItem {
  id: string;
  user_id: string;
  professional_headline: string | null;
  visibility: string;
  reputation_overall: number;
  verified_at: string | null;
  availability: Record<string, boolean>;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  skills: string[];
}

export async function browseTalents(filters?: {
  skill?: string;
  availability?: string;
  search?: string;
}) {
  const supabase = await createClient();

  const query = supabase
    .from("talent_profiles")
    .select(
      `
      id, user_id, professional_headline, visibility, reputation_overall,
      verified_at, availability,
      profiles!inner(full_name, display_name, avatar_url, location)
    `
    )
    .in("visibility", ["public", "limited"])
    .not("verified_at", "is", null);

  const { data: talents } = await query;

  if (!talents) return [];

  const talentIds = talents.map((t) => t.id);
  const { data: claims } = await supabase
    .from("skill_claims")
    .select("talent_profile_id, skills(name)")
    .in("talent_profile_id", talentIds)
    .eq("status", "verified");

  const skillsByTalent = new Map<string, string[]>();
  for (const claim of claims ?? []) {
    const skillsData = claim.skills as unknown as { name: string } | null;
    const skill = skillsData?.name;
    if (!skill) continue;
    const list = skillsByTalent.get(claim.talent_profile_id) ?? [];
    list.push(skill);
    skillsByTalent.set(claim.talent_profile_id, list);
  }

  let items: TalentBrowseItem[] = talents.map((t) => {
    const profile = t.profiles as unknown as {
      full_name: string | null;
      display_name: string | null;
      avatar_url: string | null;
      location: string | null;
    };
    return {
      id: t.id,
      user_id: t.user_id,
      professional_headline: t.professional_headline,
      visibility: t.visibility,
      reputation_overall: Number(t.reputation_overall),
      verified_at: t.verified_at,
      availability: (t.availability as Record<string, boolean>) ?? {},
      full_name: profile.full_name,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      location: profile.location,
      skills: skillsByTalent.get(t.id) ?? [],
    };
  });

  if (filters?.skill) {
    items = items.filter((t) =>
      t.skills.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase()))
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (t) =>
        t.professional_headline?.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (filters?.availability) {
    items = items.filter((t) => t.availability[filters.availability!] === true);
  }

  return items;
}

export async function getTalentById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("talent_profiles")
    .select(
      `
      *,
      profiles(full_name, display_name, avatar_url, location, bio, linkedin_url, github_url, website_url)
    `
    )
    .eq("id", id)
    .single();

  if (!data) return null;

  const { data: claims } = await supabase
    .from("skill_claims")
    .select("*, skills(name, category)")
    .eq("talent_profile_id", id)
    .in("status", ["verified", "partial"]);

  return { ...data, skill_claims: claims ?? [] };
}
