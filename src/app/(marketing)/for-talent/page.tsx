import { Button } from "@/components/ui/Button";
import { forTalentContent } from "@/lib/content/pages";
import { GraduationCap, BadgeCheck, Eye, Star, Briefcase } from "lucide-react";

const icons = [Briefcase, BadgeCheck, GraduationCap, Eye, Star];

export const metadata = { title: "For Talent" };

export default function ForTalentPage() {
  const { headline, subheadline, benefits, cta } = forTalentContent;

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <GraduationCap size={24} />
      </div>
      <h1 className="display-md max-w-3xl">{headline}</h1>
      <p className="body-lede mt-6 max-w-2xl">{subheadline}</p>

      <div className="mt-16 space-y-6">
        {benefits.map((benefit, i) => {
          const Icon = icons[i] ?? BadgeCheck;
          return (
            <div key={benefit.title} className="card-surface flex gap-5 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon size={22} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">{benefit.title}</h2>
                <p className="mt-2 text-sm text-text-muted">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <Button href={cta.href}>{cta.label}</Button>
      </div>
    </div>
  );
}
