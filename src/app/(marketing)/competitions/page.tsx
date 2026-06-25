import { Button } from "@/components/ui/Button";
import { competitionsContent } from "@/lib/content/pages";
import { Trophy, Info } from "lucide-react";
import { listPublicCompetitions } from "@/lib/competitions/queries";
import { CompetitionCard } from "@/components/marketing/CompetitionCard";

export const metadata = { title: "Competitions" };

export default async function CompetitionsPage() {
  const competitions = await listPublicCompetitions();
  const { headline, subheadline, types, dailyBudgetNote } = competitionsContent;

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Trophy size={24} />
      </div>
      <h1 className="display-md max-w-3xl">{headline}</h1>
      <p className="body-lede mt-6 max-w-2xl">{subheadline}</p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {types.map((type) => (
          <div key={type.title} className="card-surface p-6">
            <h2 className="text-lg font-semibold text-text">{type.title}</h2>
            <p className="mt-2 text-sm text-text-muted">{type.description}</p>
            <p className="mt-3 text-xs text-text-soft">
              <span className="font-medium text-text-muted">Best for:</span> {type.bestFor}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface-soft p-4 text-sm text-text-muted">
        <Info size={18} className="mt-0.5 shrink-0 text-brand" />
        {dailyBudgetNote}
      </div>

      <div className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="heading-section">Open Competitions</h2>
          <Button href="/client/competitions/new" variant="outline">
            Launch a Competition
          </Button>
        </div>
        {competitions.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Trophy size={40} className="mx-auto text-text-soft" />
            <p className="mt-4 text-text-muted">No open competitions yet.</p>
            <Button href="/signup" className="mt-6" variant="secondary">
              Get Started as a Client
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {competitions.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
