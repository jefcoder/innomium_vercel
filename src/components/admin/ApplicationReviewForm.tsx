"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reviewTalentApplication } from "@/lib/applications/actions";
import { Button } from "@/components/ui/Button";

interface ApplicationReviewFormProps {
  applicationId: string;
  currentStatus: string;
}

export function ApplicationReviewForm({
  applicationId,
  currentStatus,
}: ApplicationReviewFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isFinal = ["approved", "rejected"].includes(currentStatus);

  async function handleAction(action: "approve" | "reject" | "more_info") {
    setPending(true);
    setMessage(null);
    const result = await reviewTalentApplication(applicationId, action, notes || undefined);
    if (result.success) {
      setMessage(`Application ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "updated"}.`);
      router.refresh();
    } else {
      setMessage("Action failed. Please try again.");
    }
    setPending(false);
  }

  if (isFinal) {
    return (
      <p className="text-sm text-text-muted">
        This application has been {currentStatus}. No further action needed.
      </p>
    );
  }

  return (
    <div className="card-surface space-y-4 p-6">
      <h2 className="text-lg font-semibold text-text">Review decision</h2>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Reviewer notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="field-input"
          placeholder="Optional notes for the applicant…"
        />
      </label>
      {message && <p className="text-sm text-brand">{message}</p>}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          showArrow={false}
          disabled={pending}
          onClick={() => handleAction("approve")}
        >
          Approve
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleAction("more_info")}
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text hover:border-brand"
        >
          Request more info
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleAction("reject")}
          className="rounded-lg border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
