import { Search } from "lucide-react";
import { browseTalentContent } from "@/lib/content/pages";
import { browseTalents } from "@/lib/talents/queries";
import { listSkills } from "@/lib/skills/queries";
import { TalentCard } from "@/components/marketing/TalentCard";
import { TalentFilters } from "@/components/marketing/TalentFilters";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export const metadata = { title: "Browse Talent" };

interface PageProps {
  searchParams: Promise<{ skill?: string; search?: string; availability?: string }>;
}

export default async function BrowseTalentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [talents, skills] = await Promise.all([
    browseTalents(params),
    listSkills(),
  ]);

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Search size={24} />
      </div>
      <h1 className="display-md">{browseTalentContent.headline}</h1>
      <p className="body-lede mt-4 max-w-2xl">{browseTalentContent.subheadline}</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
        <TalentFilters skills={skills} current={params} />
        <div>
          <p className="mb-6 text-sm text-text-muted">
            {talents.length} verified {talents.length === 1 ? "talent" : "talents"} found
          </p>
          {talents.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <p className="text-text-muted">No public talent profiles match your filters yet.</p>
              <Button href="/apply" className="mt-6" variant="secondary">
                Apply as Talent
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {talents.map((t) => (
                <TalentCard key={t.id} talent={t} />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-start gap-3 rounded-xl border border-border bg-brand-soft/40 p-5">
            <Lock size={20} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="text-sm text-text-body">{browseTalentContent.hiddenMessage}</p>
              <Button href="/client/requests/new" variant="ghost" className="mt-2 px-0">
                Request Hidden Talent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
