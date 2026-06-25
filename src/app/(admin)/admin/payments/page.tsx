import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: payouts }] = await Promise.all([
    supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("payouts").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text">Payments</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Client payments</h2>
        {!payments?.length ? (
          <EmptyState title="No payments" description="Client payment records will appear here." />
        ) : (
          <ul className="space-y-2">
            {payments.map((payment) => (
              <li key={payment.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">
                    {formatCurrency(payment.amount_cents, payment.currency.toUpperCase())}
                  </p>
                  <p className="text-sm text-text-muted">{formatDate(payment.created_at)}</p>
                </div>
                <Badge variant={payment.status === "succeeded" ? "success" : "muted"}>
                  {payment.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Talent payouts</h2>
        {!payouts?.length ? (
          <EmptyState title="No payouts" description="Talent payout records will appear here." />
        ) : (
          <ul className="space-y-2">
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
      </section>
    </div>
  );
}
