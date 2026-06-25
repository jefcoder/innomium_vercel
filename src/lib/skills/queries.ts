import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/lib/profiles/types";

export async function listSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("skills").select("*").order("category").order("name");
  return (data ?? []) as Skill[];
}

export async function getSkillsByCategory() {
  const skills = await listSkills();
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
}
