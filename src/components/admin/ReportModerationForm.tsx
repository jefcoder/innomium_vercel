"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { moderateReport } from "@/lib/reputation/actions";
import { Button } from "@/components/ui/Button";

interface ReportModerationFormProps {
  reportId: string;
}

export function ReportModerationForm({ reportId }: ReportModerationFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  async function handleAction(status: "confirmed" | "dismissed") {
    setPending(true);
    await moderateReport(reportId, status, notes || undefined);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Admin notes"
        className="field-input flex-1"
      />
      <Button type="button" showArrow={false} disabled={pending} onClick={() => handleAction("confirmed")}>
        Confirm
      </Button>
      <button
        type="button"
        disabled={pending}
        onClick={() => handleAction("dismissed")}
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-brand"
      >
        Dismiss
      </button>
    </div>
  );
}
