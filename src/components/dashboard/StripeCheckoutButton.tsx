"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface StripeCheckoutButtonProps {
  label?: string;
  amountCents: number;
  clientProfileId: string;
  referenceType: string;
  referenceId: string;
  description: string;
}

export function StripeCheckoutButton({
  label = "Pay with Stripe",
  amountCents,
  clientProfileId,
  referenceType,
  referenceId,
  description,
}: StripeCheckoutButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleCheckout() {
    if (!amountCents || !clientProfileId) return;
    setPending(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          clientProfileId,
          referenceType,
          referenceId,
          description,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" showArrow={false} disabled={pending} onClick={handleCheckout}>
      {label}
    </Button>
  );
}
