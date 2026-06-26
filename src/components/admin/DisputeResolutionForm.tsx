"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resolveTaskDispute } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface DisputeResolutionFormProps {
  taskId: string;
  taskTitle: string;
}

export function DisputeResolutionForm({ taskId, taskTitle }: DisputeResolutionFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  async function handleResolve(resolution: "completed" | "revision_requested" | "closed") {
    setPending(true);
    await resolveTaskDispute(taskId, resolution, notes || undefined);
    router.refresh();
    setPending(false);
  }

  return (
    <li className="card-surface space-y-3 p-4">
      <div>
        <p className="font-medium text-text">{taskTitle}</p>
        <p className="text-sm text-text-muted">Task ID: {taskId}</p>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Resolution notes…"
        className="field-input"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" showArrow={false} disabled={pending} onClick={() => handleResolve("completed")}>
          Mark completed
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleResolve("revision_requested")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-brand"
        >
          Request revision
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleResolve("closed")}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Close task
        </button>
      </div>
    </li>
  );
}
