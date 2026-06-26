"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTaskWork } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface SubmitWorkFormProps {
  taskId: string;
}

export function SubmitWorkForm({ taskId }: SubmitWorkFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    setPending(true);
    await submitTaskWork(taskId, notes);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="card-surface space-y-3 p-4">
      <h3 className="font-semibold text-text">Submit work</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Submission notes…"
        className="field-input"
      />
      <Button type="button" showArrow={false} disabled={pending} onClick={handleSubmit}>
        Submit for review
      </Button>
    </div>
  );
}
