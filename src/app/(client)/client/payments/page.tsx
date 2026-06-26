import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Payments</h1>

      {params.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          Payment completed successfully.
        </p>
      )}
      {params.cancelled && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Payment was cancelled.
        </p>
      )}

      {!payments?.length ? (
        <EmptyState
          title="No payments yet"
          description="Payment history for consults, tasks, and competitions will appear here."
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
