import { requireProfile } from "@/lib/profiles/queries";
import { updateProfile } from "@/lib/profiles/actions";
import { Button } from "@/components/ui/Button";

export default async function TalentSettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Settings</h1>
      <form action={updateProfile} className="card-surface max-w-2xl space-y-4 p-6">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Location</span>
          <input
            name="location"
            defaultValue={profile.location ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Timezone</span>
          <input
            name="timezone"
            defaultValue={profile.timezone ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Website</span>
          <input
            name="websiteUrl"
            defaultValue={profile.website_url ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">LinkedIn</span>
          <input
            name="linkedinUrl"
            defaultValue={profile.linkedin_url ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">GitHub</span>
          <input
            name="githubUrl"
            defaultValue={profile.github_url ?? ""}
            className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
          />
        </label>
        <input type="hidden" name="fullName" value={profile.full_name ?? ""} />
        <input type="hidden" name="displayName" value={profile.display_name ?? ""} />
        <input type="hidden" name="headline" value={profile.headline ?? ""} />
        <input type="hidden" name="bio" value={profile.bio ?? ""} />
        <Button type="submit" showArrow={false}>
          Save settings
        </Button>
      </form>
    </div>
  );
}
