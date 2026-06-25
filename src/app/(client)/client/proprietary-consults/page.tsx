import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function ClientProprietaryConsultsPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: proprietary } = await supabase
    .from("proprietary_consult_requests")
    .select("*, client_requests!inner(id, title, status, client_profile_id)")
    .eq("client_requests.client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Proprietary consults</h1>
        <Button href="/client/proprietary-consults/new">New request</Button>
      </div>

      {!proprietary?.length ? (
        <EmptyState
          title="No proprietary consults"
          description="Confidential advisory requests with staged disclosure and NDA support."
          action={<Button href="/client/proprietary-consults/new">Create request</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {proprietary.map((item) => {
            const request = item.client_requests as { id: string; title: string };
            return (
              <li key={item.id}>
                <Link
                  href={`/client/requests/${request.id}`}
                  className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      {item.disclosure_stage} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Badge variant="warning">{item.lifecycle_status}</Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
