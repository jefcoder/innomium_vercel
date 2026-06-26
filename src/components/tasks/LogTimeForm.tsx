"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logTime } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface LogTimeFormProps {
  taskId: string;
}

export function LogTimeForm({ taskId }: LogTimeFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("taskId", taskId);
    await logTime(formData);
    router.refresh();
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface space-y-3 p-4">
      <h3 className="font-semibold text-text">Log time</h3>
      <input name="hours" type="number" step="0.25" min={0.25} required placeholder="Hours" className="field-input" />
      <textarea name="description" rows={2} placeholder="What did you work on?" className="field-input" />
      <Button type="submit" showArrow={false} disabled={pending}>
        Log time
      </Button>
    </form>
  );
}
