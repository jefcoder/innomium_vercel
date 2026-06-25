import { NextResponse } from "next/server";
import { createConnectAccount, createConnectOnboardingLink } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";

export async function POST() {
  try {
    const profile = await requireProfile();
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

    let accountId = profile.stripe_connect_id;

    if (!accountId) {
      const account = await createConnectAccount(
        (await supabase.auth.getUser()).data.user?.email ?? ""
      );
      accountId = account.id;
      await supabase
        .from("profiles")
        .update({ stripe_connect_id: accountId })
        .eq("id", profile.id);
    }

    const url = await createConnectOnboardingLink(accountId, `${siteUrl}/talent/earnings`);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Connect failed" },
      { status: 500 }
    );
  }
}
