"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface StripeConnectButtonProps {
  label?: string;
}

export function StripeConnectButton({ label = "Connect payout account" }: StripeConnectButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleConnect() {
    setPending(true);
    try {
      const res = await fetch("/api/stripe/connect-onboard", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" showArrow={false} disabled={pending} onClick={handleConnect}>
      {label}
    </Button>
  );
}
