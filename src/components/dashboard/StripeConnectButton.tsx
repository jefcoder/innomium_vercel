"use client";

import { Button } from "@/components/ui/Button";

export function StripeConnectButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      showArrow={false}
      onClick={() => alert("Stripe Connect onboarding coming soon.")}
    >
      Connect payout account
    </Button>
  );
}
