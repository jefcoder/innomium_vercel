import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminClientRequestsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("client_requests")
    .select("*, client_profiles(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Client requests</h1>

      {!requests?.length ? (
        <EmptyState title="No client requests" description="Submitted client requests will appear here." />
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => {
            const client = request.client_profiles as { company_name: string | null } | null;
            return (
              <li key={request.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-text">{request.title}</p>
                  <p className="text-sm text-text-muted">
                    {client?.company_name ?? "Client"} · {request.request_type} ·{" "}
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <Badge variant={request.status === "submitted" ? "brand" : "muted"}>
                  {request.status}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
