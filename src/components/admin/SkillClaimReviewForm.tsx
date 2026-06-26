"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifySkillClaim } from "@/lib/applications/actions";
import { Button } from "@/components/ui/Button";

interface SkillClaimReviewFormProps {
  claimId: string;
  skillName: string;
  level: number;
  explanation?: string | null;
}

export function SkillClaimReviewForm({
  claimId,
  skillName,
  level,
  explanation,
}: SkillClaimReviewFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  async function handleOutcome(outcome: "verified" | "rejected" | "partial") {
    setPending(true);
    await verifySkillClaim(claimId, outcome, notes || undefined);
    router.refresh();
    setPending(false);
  }

  return (
    <li className="card-surface space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text">{skillName}</p>
          <p className="text-sm text-text-muted">Level {level}</p>
          {explanation && (
            <p className="mt-2 text-sm text-text-muted">{explanation}</p>
          )}
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="field-input w-full"
        placeholder="Verification notes…"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          showArrow={false}
          disabled={pending}
          onClick={() => handleOutcome("verified")}
        >
          Verify
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleOutcome("partial")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text hover:border-brand"
        >
          Partial
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleOutcome("rejected")}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Reject
        </button>
      </div>
    </li>
  );
}
