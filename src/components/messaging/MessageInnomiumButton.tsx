"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createThread } from "@/lib/messaging/actions";
import { Button } from "@/components/ui/Button";

interface MessageInnomiumButtonProps {
  requestId: string;
  requestTitle: string;
}

export function MessageInnomiumButton({ requestId, requestTitle }: MessageInnomiumButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await createThread(
      [],
      requestTitle,
      "client_request",
      requestId,
      `I'd like to discuss my request "${requestTitle}".`
    );
    router.push("/client/messages");
    setPending(false);
  }

  return (
    <Button type="button" variant="secondary" showArrow={false} disabled={pending} onClick={handleClick}>
      Message Innomium
    </Button>
  );
}
