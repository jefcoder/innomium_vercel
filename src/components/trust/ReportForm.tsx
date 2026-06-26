"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReport } from "@/lib/reputation/actions";
import { Button } from "@/components/ui/Button";

interface ReportFormProps {
  reportedId: string;
  referenceType?: string;
  referenceId?: string;
}

export function ReportForm({ reportedId, referenceType, referenceId }: ReportFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("reportedId", reportedId);
    if (referenceType) formData.set("referenceType", referenceType);
    if (referenceId) formData.set("referenceId", referenceId);
    await submitReport(formData);
    setOpen(false);
    router.refresh();
    setPending(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-text-muted hover:text-red-600"
      >
        Report issue
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="card-surface mt-4 space-y-3 p-4">
      <h3 className="font-semibold text-text">Report</h3>
      <select name="category" required className="field-input" defaultValue="misconduct">
        <option value="misconduct">Misconduct</option>
        <option value="quality">Quality issue</option>
        <option value="fraud">Fraud</option>
        <option value="other">Other</option>
      </select>
      <textarea name="description" required rows={3} className="field-input" placeholder="Describe the issue…" />
      <div className="flex gap-2">
        <Button type="submit" showArrow={false} disabled={pending}>
          Submit report
        </Button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-text-muted">
          Cancel
        </button>
      </div>
    </form>
  );
}
