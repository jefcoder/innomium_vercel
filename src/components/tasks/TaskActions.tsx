"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveMilestone,
  markTaskComplete,
  openTaskDispute,
} from "@/lib/requests/actions";
import { StripeCheckoutButton } from "@/components/dashboard/StripeCheckoutButton";
import { Button } from "@/components/ui/Button";

interface TaskActionsProps {
  taskId: string;
  clientProfileId: string;
  lifecycleStatus: string;
  milestones: Array<{ id: string; title: string; amount_cents: number; status: string }>;
}

export function TaskActions({
  taskId,
  clientProfileId,
  lifecycleStatus,
  milestones,
}: TaskActionsProps) {
  const router = useRouter();
  const [disputeReason, setDisputeReason] = useState("");
  const [pending, setPending] = useState(false);

  async function handleDispute() {
    if (!disputeReason.trim()) return;
    setPending(true);
    await openTaskDispute(taskId, disputeReason);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="space-y-4">
      {milestones
        .filter((m) => m.status !== "approved")
        .map((milestone) => (
          <div key={milestone.id} className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await approveMilestone(milestone.id, taskId);
                router.refresh();
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text hover:border-brand"
            >
              Approve {milestone.title}
            </button>
            <StripeCheckoutButton
              label={`Pay ${milestone.title}`}
              amountCents={milestone.amount_cents}
              clientProfileId={clientProfileId}
              referenceType="task_milestone"
              referenceId={milestone.id}
              description={`Payment for milestone: ${milestone.title}`}
            />
          </div>
        ))}

      {lifecycleStatus === "submitted" && (
        <Button
          type="button"
          showArrow={false}
          onClick={async () => {
            await markTaskComplete(taskId);
            router.refresh();
          }}
        >
          Mark complete
        </Button>
      )}

      {["active", "submitted", "revision_requested"].includes(lifecycleStatus) && (
        <div className="card-surface space-y-3 p-4">
          <h3 className="font-semibold text-text">Open dispute</h3>
          <textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            rows={2}
            className="field-input"
            placeholder="Describe the issue…"
          />
          <button
            type="button"
            disabled={pending}
            onClick={handleDispute}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Open dispute
          </button>
        </div>
      )}
    </div>
  );
}
