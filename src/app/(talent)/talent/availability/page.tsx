import { getTalentProfile } from "@/lib/profiles/helpers";
import { updateTalentAvailability } from "@/lib/profiles/actions";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function TalentAvailabilityPage() {
  const talentProfile = await getTalentProfile();

  if (!talentProfile) {
    return (
      <EmptyState
        title="Availability unavailable"
        description="Complete your talent application to set availability."
      />
    );
  }

  const availability = talentProfile.availability as Record<string, boolean>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Availability</h1>
      <form action={updateTalentAvailability} className="card-surface max-w-lg space-y-4 p-6">
        <p className="text-sm text-text-muted">
          Choose which engagement types you are open to right now.
        </p>
        {(["consulting", "proprietary", "tasks", "competitions"] as const).map((key) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name={key}
              defaultChecked={availability[key]}
              className="h-4 w-4 rounded border-border"
            />
            <span className="capitalize text-text">{key}</span>
          </label>
        ))}
        <Button type="submit" showArrow={false}>
          Save availability
        </Button>
      </form>
    </div>
  );
}
