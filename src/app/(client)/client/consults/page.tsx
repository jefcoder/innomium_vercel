import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function ClientConsultsPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: consults } = await supabase
    .from("consult_requests")
    .select("*, client_requests!inner(id, title, status, client_profile_id)")
    .eq("client_requests.client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Consults</h1>
        <Button href="/client/consults/new">New consult</Button>
      </div>

      {!consults?.length ? (
        <EmptyState
          title="No consult requests"
          description="Request a mentor or expert consultation with verified talent."
          action={<Button href="/client/consults/new">Request consult</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {consults.map((consult) => {
            const request = consult.client_requests as {
              id: string;
              title: string;
              status: string;
            };
            return (
              <li key={consult.id}>
                <Link
                  href={`/client/requests/${request.id}`}
                  className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      {consult.consult_type ?? "mentor"} · {formatDate(consult.created_at)}
                    </p>
                  </div>
                  <Badge variant="brand">{consult.lifecycle_status}</Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
