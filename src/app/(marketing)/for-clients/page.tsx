import { Button } from "@/components/ui/Button";
import { forClientsContent } from "@/lib/content/pages";
import { Building2, MessageSquare, Lock, Code2, Trophy, Users } from "lucide-react";

const capabilityIcons = [Users, MessageSquare, Lock, Code2, Trophy, Users];

export const metadata = { title: "For Clients" };

export default function ForClientsPage() {
  const { headline, subheadline, capabilities, cta } = forClientsContent;

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Building2 size={24} />
      </div>
      <h1 className="display-md max-w-3xl">{headline}</h1>
      <p className="body-lede mt-6 max-w-2xl">{subheadline}</p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {capabilities.map((cap, i) => {
          const Icon = capabilityIcons[i] ?? Users;
          return (
            <div key={cap.title} className="card-surface p-6">
              <Icon size={22} className="mb-4 text-brand" aria-hidden />
              <h2 className="text-lg font-semibold text-text">{cap.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{cap.description}</p>
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
