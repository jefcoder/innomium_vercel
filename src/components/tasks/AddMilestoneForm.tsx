"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMilestone } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface AddMilestoneFormProps {
  taskId: string;
}

export function AddMilestoneForm({ taskId }: AddMilestoneFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("taskId", taskId);
    await addMilestone(formData);
    router.refresh();
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface space-y-3 p-4">
      <h3 className="font-semibold text-text">Add milestone</h3>
      <input name="title" required placeholder="Title" className="field-input" />
      <input name="deliverable" placeholder="Deliverable" className="field-input" />
      <input name="amount" type="number" step="0.01" required placeholder="Amount (USD)" className="field-input" />
      <input name="criteria" placeholder="Acceptance criteria" className="field-input" />
      <input name="dueAt" type="date" className="field-input" />
      <Button type="submit" showArrow={false} disabled={pending}>
        Add milestone
      </Button>
    </form>
  );
}
