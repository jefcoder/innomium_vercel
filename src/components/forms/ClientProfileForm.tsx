"use client";

import { updateClientProfile } from "@/lib/profiles/actions";
import { Button } from "@/components/ui/Button";
import type { ClientProfile } from "@/lib/profiles/types";

interface ClientProfileFormProps {
  profile: ClientProfile | null;
}

export function ClientProfileForm({ profile }: ClientProfileFormProps) {
  return (
    <form action={updateClientProfile} className="card-surface max-w-2xl space-y-4 p-6">
      <h2 className="text-lg font-semibold text-text">Company profile</h2>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Company name</span>
        <input
          name="companyName"
          defaultValue={profile?.company_name ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Website</span>
        <input
          name="companyWebsite"
          defaultValue={profile?.company_website ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Industry</span>
        <input
          name="industry"
          defaultValue={profile?.industry ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Company size</span>
        <input
          name="companySize"
          defaultValue={profile?.company_size ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Location</span>
        <input
          name="location"
          defaultValue={profile?.location ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={profile?.description ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Primary contact name</span>
        <input
          name="contactName"
          defaultValue={profile?.primary_contact_name ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Primary contact email</span>
        <input
          name="contactEmail"
          type="email"
          defaultValue={profile?.primary_contact_email ?? ""}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <Button type="submit" showArrow={false}>
        Save changes
      </Button>
    </form>
  );
}
