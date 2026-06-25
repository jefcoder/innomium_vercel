import { Button } from "@/components/ui/Button";
import { trustContent } from "@/lib/content/pages";
import { ShieldCheck } from "lucide-react";
import { trustIcons } from "@/lib/icons";

const principleIcons = [
  trustIcons.verified,
  trustIcons.vetting,
  trustIcons.reputation,
  trustIcons.visibility,
  trustIcons.legal,
];

export const metadata = { title: "Trust & Vetting" };

export default function TrustPage() {
  const { headline, subheadline, principles } = trustContent;

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <ShieldCheck size={24} />
      </div>
      <h1 className="display-md max-w-3xl">{headline}</h1>
      <p className="body-lede mt-6 max-w-2xl">{subheadline}</p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {principles.map((principle, i) => {
          const Icon = principleIcons[i] ?? ShieldCheck;
          return (
            <div key={principle.title} className="card-surface p-6">
              <Icon size={22} className="mb-4 text-brand" aria-hidden />
              <h2 className="text-lg font-semibold text-text">{principle.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{principle.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/apply">Apply as Talent</Button>
        <Button href="/talents" variant="outline">
          Browse Verified Talent
        </Button>
      </div>
    </div>
  );
}
