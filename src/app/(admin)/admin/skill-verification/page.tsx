import { createClient } from "@/lib/supabase/server";
import { SkillClaimReviewForm } from "@/components/admin/SkillClaimReviewForm";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function AdminSkillVerificationPage() {
  const supabase = await createClient();

  const { data: claims } = await supabase
    .from("skill_claims")
    .select("*, skills(name, category), talent_profiles(professional_headline)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Skill verification</h1>

      {!claims?.length ? (
        <EmptyState title="No pending claims" description="Skill claims awaiting review will appear here." />
      ) : (
        <ul className="space-y-3">
          {claims.map((claim) => {
            const skill = claim.skills as { name: string; category: string } | null;
            return (
              <SkillClaimReviewForm
                key={claim.id}
                claimId={claim.id}
                skillName={skill?.name ?? "Skill"}
                level={claim.level}
                explanation={claim.explanation}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
