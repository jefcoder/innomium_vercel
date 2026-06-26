"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/reputation/actions";
import { Button } from "@/components/ui/Button";

interface ReviewFormProps {
  revieweeId: string;
  referenceType: string;
  referenceId: string;
}

export function ReviewForm({ revieweeId, referenceType, referenceId }: ReviewFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("revieweeId", revieweeId);
    formData.set("referenceType", referenceType);
    formData.set("referenceId", referenceId);
    await submitReview(formData);
    router.refresh();
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface space-y-3 p-4">
      <h3 className="font-semibold text-text">Leave a review</h3>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Rating (1–5)</span>
        <select name="rating" required className="field-input" defaultValue="4">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Dimension</span>
        <select name="dimension" className="field-input" defaultValue="tasks">
          <option value="consulting">Consulting</option>
          <option value="tasks">Tasks</option>
          <option value="competitions">Competitions</option>
          <option value="overall">Overall</option>
        </select>
      </label>
      <textarea name="comment" rows={3} placeholder="Comment" className="field-input" />
      <Button type="submit" showArrow={false} disabled={pending}>
        Submit review
      </Button>
    </form>
  );
}
