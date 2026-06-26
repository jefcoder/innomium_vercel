"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToInvitation } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface InvitationActionsProps {
  invitationId: string;
  status: string;
}

export function InvitationActions({ invitationId, status }: InvitationActionsProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  if (status !== "pending") return null;

  async function handleResponse(response: "accepted" | "declined") {
    setPending(true);
    await respondToInvitation(invitationId, response, notes || undefined);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="field-input w-full"
        placeholder="Optional response notes…"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          showArrow={false}
          disabled={pending}
          onClick={() => handleResponse("accepted")}
        >
          Accept
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleResponse("declined")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text hover:border-brand"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
