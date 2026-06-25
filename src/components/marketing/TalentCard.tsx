import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/Button";
import type { TalentBrowseItem } from "@/lib/talents/queries";

interface TalentCardProps {
  talent: TalentBrowseItem;
}

export function TalentCard({ talent }: TalentCardProps) {
  const name =
    talent.visibility === "hidden"
      ? "Verified Expert"
      : talent.display_name || talent.full_name || "AI/ML Expert";

  return (
    <div className="card-surface p-6">
      <div className="flex items-start gap-4">
        <UserAvatar
          name={name}
          imageUrl={talent.visibility === "hidden" ? null : talent.avatar_url}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-text">{name}</h3>
            {talent.verified_at && (
              <Badge variant="success">
                <BadgeCheck size={12} />
                Verified
              </Badge>
            )}
            <Badge variant="muted">{talent.visibility}</Badge>
          </div>
          <p className="mt-1 text-sm text-brand">{talent.professional_headline}</p>
        </div>
      </div>

      {talent.skills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-soft">
            Verified Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {talent.skills.slice(0, 5).map((s) => (
              <Badge key={s} variant="brand">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
        {talent.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {talent.location}
          </span>
        )}
        {talent.reputation_overall > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="text-amber-500" />
            {talent.reputation_overall.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-5">
        <Button
          href={`/talents/${talent.id}`}
          variant="outline"
          className="w-full"
          showArrow={false}
        >
          {talent.visibility === "hidden" ? "Request Introduction" : "View Profile"}
        </Button>
      </div>
    </div>
  );
}
