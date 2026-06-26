"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientRequest } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface RequestWizardProps {
  defaultType?: string;
}

export function RequestWizard({ defaultType = "consult" }: RequestWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [requestType, setRequestType] = useState(defaultType);

  const steps = ["Basics", "Details", "Review"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await createClientRequest(formData);
    if (result.success && result.requestId) {
      router.push(`/client/requests/${result.requestId}`);
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex gap-2">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              i === step ? "bg-brand text-white" : "bg-surface-soft text-text-muted"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Request basics</h2>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Type</span>
            <select
              name="requestType"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="field-input"
            >
              <option value="consult">Consult</option>
              <option value="proprietary">Proprietary consult</option>
              <option value="task">Task</option>
              <option value="competition">Competition</option>
              <option value="matching">Matching</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Title</span>
            <input name="title" required className="field-input" />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Summary</span>
            <textarea name="summary" rows={2} className="field-input" />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Description</span>
            <textarea name="description" rows={4} className="field-input" />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Domain</span>
            <input name="domain" placeholder="e.g. NLP, Computer Vision" className="field-input" />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Type-specific details</h2>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Budget (USD)</span>
            <input name="budget" type="number" min={0} step="0.01" className="field-input" />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Timing</span>
            <select name="timingType" className="field-input" defaultValue="flexible">
              <option value="flexible">Flexible</option>
              <option value="urgent">Urgent</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-text">Visibility</span>
            <select name="visibility" className="field-input" defaultValue="innomium_only">
              <option value="innomium_only">Innomium only</option>
              <option value="public">Public</option>
            </select>
          </label>
          <input type="hidden" name="matchPreference" value="innomium_recommend" />

          {requestType === "consult" && (
            <>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Consult type</span>
                <select name="consultType" className="field-input" defaultValue="mentor">
                  <option value="mentor">Mentor</option>
                  <option value="expert">Expert</option>
                  <option value="review">Review</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Duration (minutes)</span>
                <input name="duration" type="number" defaultValue={60} className="field-input" />
              </label>
              <input type="hidden" name="paymentModel" value="hourly" />
            </>
          )}

          {requestType === "proprietary" && (
            <>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Client anonymity</span>
                <select name="clientAnonymity" className="field-input" defaultValue="anonymous">
                  <option value="anonymous">Anonymous</option>
                  <option value="named">Named</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Talent anonymity</span>
                <select name="talentAnonymity" className="field-input" defaultValue="anonymous">
                  <option value="anonymous">Anonymous</option>
                  <option value="named">Named</option>
                </select>
              </label>
              <input type="hidden" name="paymentModel" value="fixed" />
            </>
          )}

          {requestType === "task" && (
            <>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Task type</span>
                <input name="taskType" placeholder="e.g. Model fine-tuning" className="field-input" />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Payment model</span>
                <select name="paymentModel" className="field-input" defaultValue="milestone">
                  <option value="hourly">Hourly</option>
                  <option value="milestone">Milestone</option>
                  <option value="fixed">Fixed</option>
                </select>
              </label>
            </>
          )}

          {requestType === "competition" && (
            <>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-text">Reward model</span>
                <select name="paymentModel" className="field-input" defaultValue="final_score">
                  <option value="final_score">Final score</option>
                  <option value="contribution">Contribution-based</option>
                  <option value="manual_judge">Manual judge</option>
                  <option value="daily_budget">Daily budget</option>
                </select>
              </label>
            </>
          )}

          {requestType === "matching" && (
            <input type="hidden" name="paymentModel" value="fixed" />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Review & submit</h2>
          <p className="text-sm text-text-muted">
            Your request will be reviewed by Innomium before talent matching begins.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text hover:border-brand"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <Button type="submit" showArrow={false}>
            Continue
          </Button>
        ) : (
          <>
            <Button type="submit" showArrow={false} disabled={pending}>
              Save draft
            </Button>
            <button
              type="submit"
              name="publish"
              value="true"
              disabled={pending}
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text hover:border-brand"
            >
              Submit for review
            </button>
          </>
        )}
      </div>
    </form>
  );
}
