"use client";

export function CompetitionForm() {
  return (
    <form className="card-surface mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-lg font-semibold text-text">Create competition</h2>
      <p className="text-sm text-text-muted">
        Competition creation form placeholder. Use the request wizard with type
        &quot;competition&quot; or extend this form later.
      </p>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Title</span>
        <input
          name="title"
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
    </form>
  );
}
