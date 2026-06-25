import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StripeConnectButton } from "@/components/dashboard/StripeConnectButton";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function TalentEarningsPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: payouts } = await supabase
    .from("payouts")
    .select("*")
    .eq("talent_profile_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Earnings</h1>
        <StripeConnectButton />
      </div>

      {!payouts?.length ? (
        <EmptyState
          title="No payouts yet"
          description="Connect your payout account to receive earnings from tasks and competitions."
          action={<StripeConnectButton />}
        />
      ) : (
        <ul className="space-y-3">
          {payouts.map((payout) => (
            <li key={payout.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-text">
                  {formatCurrency(payout.amount_cents, payout.currency.toUpperCase())}
                </p>
                <p className="text-sm text-text-muted">{formatDate(payout.created_at)}</p>
              </div>
              <Badge variant={payout.status === "succeeded" ? "success" : "muted"}>
                {payout.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
