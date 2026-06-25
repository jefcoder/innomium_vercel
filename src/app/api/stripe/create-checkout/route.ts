import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountCents, clientProfileId, referenceType, referenceId, description } = body;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

    const stripe = getStripe();
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
      success_url: `${siteUrl}/client/payments?success=1`,
      cancel_url: `${siteUrl}/client/payments?cancelled=1`,
    });

    const supabase = await createClient();
    await supabase.from("payments").insert({
      client_profile_id: clientProfileId,
      reference_type: referenceType,
      reference_id: referenceId,
      stripe_checkout_session_id: session.id,
      amount_cents: amountCents,
      status: "pending",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
