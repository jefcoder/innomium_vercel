"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerForCompetition } from "@/lib/competitions/actions";
import { Button } from "@/components/ui/Button";

interface CompetitionRegisterButtonProps {
  competitionId: string;
  isTalent: boolean;
}

export function CompetitionRegisterButton({
  competitionId,
  isTalent,
}: CompetitionRegisterButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isTalent) {
    return <Button href="/login">Sign in to register</Button>;
  }

  async function handleRegister() {
    setPending(true);
    setError(null);
    const result = await registerForCompetition(competitionId);
    if (result.error) setError(result.error);
    else router.refresh();
    setPending(false);
  }

  return (
    <div>
      <Button type="button" showArrow={false} disabled={pending} onClick={handleRegister}>
        Register to participate
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
