"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSkillClaim } from "@/lib/applications/actions";
import { Button } from "@/components/ui/Button";
import type { Skill } from "@/lib/profiles/types";
import { FileUploadField } from "@/lib/storage/upload";

interface AddSkillClaimFormProps {
  skills: Skill[];
}

export function AddSkillClaimForm({ skills }: AddSkillClaimFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");

  async function handleSubmit(formData: FormData) {
    setPending(true);
    if (evidenceUrl) formData.set("evidenceUrl", evidenceUrl);
    await addSkillClaim(formData);
    router.refresh();
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="card-surface space-y-3 p-4">
      <h3 className="font-semibold text-text">Add skill claim</h3>
      <select name="skillId" required className="field-input">
        <option value="">Select skill</option>
        {skills.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.category})
          </option>
        ))}
      </select>
      <select name="level" className="field-input" defaultValue="2">
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            Level {n}
          </option>
        ))}
      </select>
      <textarea name="explanation" rows={2} placeholder="Explain your experience" className="field-input" />
      <FileUploadField
        bucket="evidence"
        pathPrefix="skills"
        name="evidenceUrl"
        label="Evidence file (optional)"
        onUploaded={setEvidenceUrl}
      />
      <Button type="submit" showArrow={false} disabled={pending}>
        Submit claim
      </Button>
    </form>
  );
}
