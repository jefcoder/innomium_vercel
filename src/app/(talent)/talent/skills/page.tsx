import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";

export default async function TalentSkillsPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: claims } = await supabase
    .from("skill_claims")
    .select("*, skills(name, category)")
    .eq("talent_profile_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Skills</h1>

      {!claims?.length ? (
        <EmptyState
          title="No skill claims"
          description="Add skills during your application or from your profile settings."
        />
      ) : (
        <ul className="space-y-3">
          {claims.map((claim) => {
            const skill = claim.skills as { name: string; category: string } | null;
            return (
              <li key={claim.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{skill?.name ?? "Skill"}</p>
                  <p className="text-sm text-text-muted">
                    {skill?.category} · Level {claim.level}
                  </p>
                </div>
                <Badge
                  variant={
                    claim.status === "verified"
                      ? "success"
                      : claim.status === "rejected"
                        ? "warning"
                        : "muted"
                  }
                >
                  {claim.status}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
