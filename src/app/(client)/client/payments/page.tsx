import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StripeCheckoutButton } from "@/components/dashboard/StripeCheckoutButton";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientPaymentsPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Payments</h1>
        <StripeCheckoutButton />
      </div>

      {!payments?.length ? (
        <EmptyState
          title="No payments yet"
          description="Payment history for consults, tasks, and competitions will appear here."
          action={<StripeCheckoutButton label="Make a payment" />}
        />
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <li key={payment.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-text">
                  {formatCurrency(payment.amount_cents, payment.currency.toUpperCase())}
                </p>
                <p className="text-sm text-text-muted">
                  {payment.reference_type ?? "payment"} · {formatDate(payment.created_at)}
                </p>
              </div>
              <Badge variant={payment.status === "succeeded" ? "success" : "muted"}>
                {payment.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
