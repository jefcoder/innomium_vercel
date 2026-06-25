"use client";

import { useState } from "react";
import { createClientRequest } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface RequestWizardProps {
  defaultType?: string;
}

export function RequestWizard({ defaultType = "consult" }: RequestWizardProps) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await createClientRequest(formData);
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-lg font-semibold text-text">New request</h2>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Type</span>
        <select
          name="requestType"
          defaultValue={defaultType}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        >
          <option value="consult">Consult</option>
          <option value="proprietary">Proprietary consult</option>
          <option value="task">Task</option>
          <option value="competition">Competition</option>
          <option value="matching">Matching</option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Title</span>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Summary</span>
        <textarea
          name="summary"
          rows={2}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Description</span>
        <textarea
          name="description"
          rows={4}
          className="w-full rounded-lg border border-border bg-bg-pure px-3 py-2"
        />
      </label>
      <input type="hidden" name="visibility" value="innomium_only" />
      <input type="hidden" name="matchPreference" value="innomium_recommend" />
      <div className="flex gap-3 pt-2">
        <Button type="submit" showArrow={false} disabled={pending}>
          Save draft
        </Button>
        <button
          type="submit"
          name="publish"
          value="true"
          disabled={pending}
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text hover:border-brand"
        >
          Submit for review
        </button>
      </div>
    </form>
  );
}
