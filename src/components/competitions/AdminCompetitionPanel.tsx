"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  publishCompetition,
  scoreSubmission,
  finalizeLeaderboard,
} from "@/lib/competitions/actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Submission {
  id: string;
  submission_url: string | null;
  submission_notes: string | null;
  score: number | null;
  status: string;
}

interface AdminCompetitionPanelProps {
  competitionId: string;
  status: string;
  submissions: Submission[];
}

export function AdminCompetitionPanel({
  competitionId,
  status,
  submissions,
}: AdminCompetitionPanelProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handlePublish() {
    setPending(true);
    await publishCompetition(competitionId);
    router.refresh();
    setPending(false);
  }

  async function handleFinalize() {
    setPending(true);
    await finalizeLeaderboard(competitionId);
    router.refresh();
    setPending(false);
  }

  async function handleScore(submissionId: string, score: number) {
    await scoreSubmission(submissionId, score);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {["under_review", "draft"].includes(status) && (
          <Button type="button" showArrow={false} disabled={pending} onClick={handlePublish}>
            Publish competition
          </Button>
        )}
        {status === "active" && (
          <Button type="button" showArrow={false} disabled={pending} onClick={handleFinalize}>
            Finalize leaderboard
          </Button>
        )}
        <Badge variant="brand">{status}</Badge>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-text-muted">No submissions yet.</p>
        ) : (
          submissions.map((sub) => (
            <div key={sub.id} className="card-surface space-y-2 p-4">
              {sub.submission_url && (
                <a href={sub.submission_url} className="text-sm text-brand hover:underline" target="_blank" rel="noreferrer">
                  {sub.submission_url}
                </a>
              )}
              {sub.submission_notes && (
                <p className="text-sm text-text-muted">{sub.submission_notes}</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0001"
                  defaultValue={sub.score ?? undefined}
                  placeholder="Score"
                  className="field-input w-32"
                  id={`score-${sub.id}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(`score-${sub.id}`) as HTMLInputElement;
                    handleScore(sub.id, parseFloat(input.value));
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-brand"
                >
                  Save score
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
