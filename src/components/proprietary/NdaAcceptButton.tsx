"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptNda } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";

interface NdaAcceptButtonProps {
  proprietaryConsultId: string;
}

export function NdaAcceptButton({ proprietaryConsultId }: NdaAcceptButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleAccept() {
    setPending(true);
    await acceptNda(proprietaryConsultId);
    router.refresh();
    setPending(false);
  }

  return (
    <Button type="button" showArrow={false} disabled={pending} onClick={handleAccept}>
      Accept NDA
    </Button>
  );
}
