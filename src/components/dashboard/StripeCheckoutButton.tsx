"use client";

import { Button } from "@/components/ui/Button";

interface StripeCheckoutButtonProps {
  label?: string;
}

export function StripeCheckoutButton({
  label = "Pay with Stripe",
}: StripeCheckoutButtonProps) {
  return (
    <Button
      type="button"
      showArrow={false}
      onClick={() => alert("Stripe checkout integration coming soon.")}
    >
      {label}
    </Button>
  );
}
