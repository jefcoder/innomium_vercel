"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitTalentApplication } from "@/lib/applications/actions";
import type { Skill } from "@/lib/profiles/types";

const ENGAGEMENT_OPTIONS = [
  { id: "mentorship", label: "Mentorship" },
  { id: "consulting", label: "Consulting" },
  { id: "proprietary", label: "Proprietary Consulting" },
  { id: "tasks", label: "1:1 Tasks" },
  { id: "competitions", label: "Competitions" },
];

const VISIBILITY_OPTIONS = [
  { id: "public", label: "Public" },
  { id: "limited", label: "Limited" },
  { id: "hidden", label: "Hidden" },
  { id: "contribution", label: "Contribution-based" },
];

interface ApplyWizardProps {
  skills: Skill[];
  defaultName?: string;
}

export function ApplyWizard({ skills, defaultName = "" }: ApplyWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const steps = ["Basic Profile", "Skills", "Evidence", "Engagement", "Visibility", "Review"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    selectedSkills.forEach((id) => formData.append("skillIds", id));
    const result = await submitTalentApplication(formData);
    if (result.success) router.push("/talent");
    setLoading(false);
  }

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <form onSubmit={handleSubmit} className="card-surface p-8">
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "bg-brand text-white" : "bg-surface-strong text-text-muted"
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="hidden text-sm sm:inline">{s}</span>
            {i < steps.length - 1 && <div className="h-px w-4 bg-border" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Profile</h2>
          <input name="fullName" className="field-input" placeholder="Full name" defaultValue={defaultName} required />
          <input name="location" className="field-input" placeholder="Location" />
          <input name="timezone" className="field-input" placeholder="Timezone (e.g. America/New_York)" />
          <input name="linkedin" className="field-input" placeholder="LinkedIn URL" type="url" />
          <input name="github" className="field-input" placeholder="GitHub URL" type="url" />
          <input name="website" className="field-input" placeholder="Personal website" type="url" />
          <input name="currentRole" className="field-input" placeholder="Current role" />
          <input name="yearsExperience" className="field-input" placeholder="Years of experience" type="number" min={0} />
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Select AI/ML Skills</h2>
          {categories.map((cat) => (
            <div key={cat} className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-text-muted">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selectedSkills.includes(skill.id)
                          ? "border-brand bg-brand-soft text-brand-deep"
                          : "border-border text-text-muted hover:border-brand"
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Add Proof for Each Skill</h2>
          {selectedSkills.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId);
            return (
              <div key={skillId} className="rounded-lg border border-border p-4">
                <p className="font-medium text-text">{skill?.name}</p>
                <select name={`level_${skillId}`} className="field-input mt-2" defaultValue="2">
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      Level {l}
                    </option>
                  ))}
                </select>
                <textarea
                  name={`explanation_${skillId}`}
                  className="field-input mt-2"
                  placeholder="Explain your experience with this skill"
                  rows={2}
                />
                <input
                  name={`evidence_${skillId}`}
                  className="field-input mt-2"
                  placeholder="Evidence URL (GitHub, paper, portfolio...)"
                  type="url"
                />
              </div>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Engagement Types</h2>
          <div className="space-y-2">
            {ENGAGEMENT_OPTIONS.map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" name="engagementTypes" value={opt.id} className="accent-brand" />
                <span className="text-sm text-text">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Profile Visibility</h2>
          <div className="space-y-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="radio" name="visibility" value={opt.id} defaultChecked={opt.id === "limited"} />
                <span className="text-sm text-text">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-lg font-semibold">Submit for Review</h2>
          <p className="mt-2 text-sm text-text-muted">
            Your application will be reviewed by the Innomium team. You will be notified when a decision is made.
          </p>
          <p className="mt-4 text-sm text-text">
            Skills selected: {selectedSkills.length} · Status will be set to Submitted
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          showArrow={false}
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <Button type="submit" showArrow={false} disabled={loading}>
          {step === steps.length - 1 ? (loading ? "Submitting..." : "Submit Application") : (
            <>
              Next
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
