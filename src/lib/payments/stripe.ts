import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function createCheckoutSession({
  amountCents,
  clientProfileId,
  referenceType,
  referenceId,
  description,
  successUrl,
  cancelUrl,
}: {
  amountCents: number;
  clientProfileId: string;
  referenceType: string;
  referenceId: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  const supabase = await createClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: { name: description },
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  await supabase.from("payments").insert({
    client_profile_id: clientProfileId,
    reference_type: referenceType,
    reference_id: referenceId,
    stripe_checkout_session_id: session.id,
    amount_cents: amountCents,
    status: "pending",
  });

  return session;
}

export async function createConnectOnboardingLink(accountId: string, returnUrl: string) {
  const stripe = getStripe();
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: returnUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });
  return accountLink.url;
}

export async function createConnectAccount(email: string) {
  const stripe = getStripe();
  return stripe.accounts.create({
    type: "express",
    email,
    capabilities: { transfers: { requested: true } },
  });
}
