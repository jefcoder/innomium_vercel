import { Button } from "@/components/ui/Button";
import { IconFeatureCard } from "@/components/ui/IconFeatureCard";
import { homeContent } from "@/lib/content/home";
import { engagementIcons, trustIcons } from "@/lib/icons";
import { CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { hero, clientCapabilities, talentBenefits, whyInnomium } = homeContent;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-bg-pure to-bg">
        <div className="section-container py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">
            AI/ML Talent Network
          </p>
          <h1 className="display-hero max-w-4xl">{hero.headline}</h1>
          <p className="body-lede mt-6 max-w-2xl">{hero.subheadline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            {hero.primaryCTAs.map((cta) => (
              <Button key={cta.href} href={cta.href}>
                {cta.label}
              </Button>
            ))}
            <Button href={hero.secondaryCTA.href} variant="outline">
              {hero.secondaryCTA.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-container py-20">
        <h2 className="heading-section max-w-2xl">{clientCapabilities.headline}</h2>
        <p className="mt-4 max-w-2xl text-text-muted">{clientCapabilities.description}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clientCapabilities.cards.map((card) => (
            <IconFeatureCard
              key={card.key}
              icon={engagementIcons[card.key]}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-soft py-20">
        <div className="section-container">
          <h2 className="heading-section max-w-2xl">{talentBenefits.headline}</h2>
          <p className="mt-4 max-w-2xl text-text-muted">{talentBenefits.description}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {talentBenefits.cards.map((card) => (
              <IconFeatureCard
                key={card.title}
                icon={trustIcons[card.icon]}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
          <div className="mt-10">
            <Button href="/apply">Apply as Talent</Button>
          </div>
        </div>
      </section>

      <section className="section-container py-20">
        <h2 className="heading-section">{whyInnomium.headline}</h2>
        <p className="mt-4 max-w-3xl text-text-muted">{whyInnomium.description}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {whyInnomium.points.map((point) => (
            <li key={point} className="flex gap-3 text-text-body">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-brand"
                aria-hidden
              />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-brand-soft/30 py-16">
        <div className="section-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Ready to find verified AI/ML expertise?
            </h2>
            <p className="mt-2 text-text-muted">
              Browse talent, start a request, or apply to join the network.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/talents">Browse Talent</Button>
            <Button href="/signup" variant="secondary">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
