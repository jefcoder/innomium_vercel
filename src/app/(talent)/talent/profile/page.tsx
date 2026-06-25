import { getTalentProfile } from "@/lib/profiles/helpers";
import { requireProfile } from "@/lib/profiles/queries";
import { updateProfile, updateTalentVisibility } from "@/lib/profiles/actions";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function TalentProfilePage() {
  const profile = await requireProfile();
  const talentProfile = await getTalentProfile();

  if (!talentProfile) {
    return (
      <EmptyState
        title="Profile not available"
        description="Complete your talent application to unlock your profile."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Profile</h1>
      <form action={updateProfile} className="card-surface max-w-2xl space-y-4 p-6">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Full name</span>
          <input
            name="fullName"
            defaultValue={profile.full_name ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Display name</span>
          <input
            name="displayName"
            defaultValue={profile.display_name ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Headline</span>
          <input
            name="headline"
            defaultValue={profile.headline ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Bio</span>
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <Button type="submit" showArrow={false}>
          Save profile
        </Button>
      </form>

      <form action={updateTalentVisibility} className="card-surface max-w-2xl space-y-4 p-6">
        <h2 className="text-lg font-semibold text-text">Visibility & rates</h2>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Professional headline</span>
          <input
            name="headline"
            defaultValue={talentProfile.professional_headline ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Visibility</span>
          <select
            name="visibility"
            defaultValue={talentProfile.visibility}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          >
            <option value="hidden">Hidden</option>
            <option value="limited">Limited</option>
            <option value="public">Public</option>
            <option value="contribution">Contribution only</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Hourly rate (USD)</span>
          <input
            name="hourlyRate"
            type="number"
            step="0.01"
            defaultValue={
              talentProfile.hourly_rate_cents
                ? (talentProfile.hourly_rate_cents / 100).toFixed(2)
                : ""
            }
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <Button type="submit" showArrow={false}>
          Save visibility
        </Button>
      </form>
    </div>
  );
}
