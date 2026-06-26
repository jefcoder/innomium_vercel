"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitCompetitionEntry,
  recordDailyContribution,
} from "@/lib/competitions/actions";
import { Button } from "@/components/ui/Button";

interface TalentCompetitionPanelProps {
  competitionId: string;
  rewardModel: string;
  isRegistered: boolean;
}

export function TalentCompetitionPanel({
  competitionId,
  rewardModel,
  isRegistered,
}: TalentCompetitionPanelProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [dailyScore, setDailyScore] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isRegistered) {
    return <p className="text-sm text-text-muted">Register from the public competition page first.</p>;
  }

  async function handleSubmit() {
    setPending(true);
    setMessage(null);
    const result = await submitCompetitionEntry(competitionId, url, notes || undefined);
    setMessage(result.error ?? "Submission saved.");
    router.refresh();
    setPending(false);
  }

  async function handleDailyContribution() {
    setPending(true);
    setMessage(null);
    const result = await recordDailyContribution(competitionId, parseFloat(dailyScore));
    setMessage(result.error ?? "Daily contribution recorded.");
    router.refresh();
    setPending(false);
  }

  return (
    <div className="space-y-6">
      {rewardModel === "daily_budget" ? (
        <div className="card-surface space-y-3 p-4">
          <h3 className="font-semibold text-text">Record daily contribution</h3>
          <input
            type="number"
            step="0.0001"
            value={dailyScore}
            onChange={(e) => setDailyScore(e.target.value)}
            placeholder="Score"
            className="field-input"
          />
          <Button type="button" showArrow={false} disabled={pending} onClick={handleDailyContribution}>
            Submit score
          </Button>
        </div>
      ) : (
        <div className="card-surface space-y-3 p-4">
          <h3 className="font-semibold text-text">Submit entry</h3>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Submission URL"
            className="field-input"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Notes"
            className="field-input"
          />
          <Button type="button" showArrow={false} disabled={pending} onClick={handleSubmit}>
            Submit entry
          </Button>
        </div>
      )}
      {message && <p className="text-sm text-brand">{message}</p>}
    </div>
  );
}
