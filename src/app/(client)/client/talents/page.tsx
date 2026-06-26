import { browseTalents } from "@/lib/talents/queries";
import { listSkills } from "@/lib/skills/queries";
import { TalentCard } from "@/components/marketing/TalentCard";
import { TalentFilters } from "@/components/marketing/TalentFilters";
import { Button } from "@/components/ui/Button";

interface PageProps {
  searchParams: Promise<{ skill?: string; search?: string; availability?: string }>;
}

export default async function ClientTalentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [talents, skills] = await Promise.all([browseTalents(params), listSkills()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Browse talent</h1>
        <Button href="/client/requests/new?type=matching">Request matching</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <TalentFilters skills={skills} current={params} basePath="/client/talents" />
        <div>
          <p className="mb-6 text-sm text-text-muted">
            {talents.length} verified {talents.length === 1 ? "talent" : "talents"} found
          </p>
          {talents.length === 0 ? (
            <p className="text-sm text-text-muted">No talent profiles match your filters.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {talents.map((t) => (
                <TalentCard key={t.id} talent={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
