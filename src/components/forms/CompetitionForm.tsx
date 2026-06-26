"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompetition } from "@/lib/competitions/actions";
import { Button } from "@/components/ui/Button";

export function CompetitionForm() {
  const router = useRouter();
  const [rewardModel, setRewardModel] = useState("final_score");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createCompetition(formData);
    if (result.success && result.id) {
      router.push(`/client/competitions/${result.id}`);
    }
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-lg font-semibold text-text">Create competition</h2>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Title</span>
        <input name="title" required className="field-input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Description</span>
        <textarea name="description" rows={4} className="field-input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Domain</span>
        <input name="domain" className="field-input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Reward model</span>
        <select
          name="rewardModel"
          value={rewardModel}
          onChange={(e) => setRewardModel(e.target.value)}
          className="field-input"
        >
          <option value="final_score">Final score</option>
          <option value="contribution">Contribution-based</option>
          <option value="manual_judge">Manual judge</option>
          <option value="daily_budget">Daily budget</option>
        </select>
      </label>
      {rewardModel === "daily_budget" ? (
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Daily budget (USD)</span>
          <input name="dailyBudget" type="number" step="0.01" className="field-input" />
        </label>
      ) : (
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Prize pool (USD)</span>
          <input name="prizePool" type="number" step="0.01" className="field-input" />
        </label>
      )}
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Evaluation method</span>
        <input name="evaluationMethod" className="field-input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Rules</span>
        <textarea name="rules" rows={3} className="field-input" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Starts</span>
          <input name="startsAt" type="datetime-local" className="field-input" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Ends</span>
          <input name="endsAt" type="datetime-local" className="field-input" />
        </label>
      </div>
      <Button type="submit" showArrow={false} disabled={pending}>
        Submit for review
      </Button>
    </form>
  );
}
