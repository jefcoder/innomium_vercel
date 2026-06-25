import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

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
              <li key={claim.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{skill?.name ?? "Skill"}</p>
                  <p className="text-sm text-text-muted">
                    {skill?.category} · Level {claim.level} · {formatDate(claim.created_at)}
                  </p>
                </div>
                <Badge variant="warning">pending</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
