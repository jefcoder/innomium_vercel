import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function ClientRequestsPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("client_requests")
    .select("*")
    .eq("client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Requests</h1>
        <Button href="/client/requests/new">New request</Button>
      </div>

      {!requests?.length ? (
        <EmptyState
          title="No requests yet"
          description="Create your first request to get matched with verified AI/ML talent."
          action={<Button href="/client/requests/new">Create request</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/client/requests/${request.id}`}
                className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-text">{request.title}</p>
                  <p className="text-sm text-text-muted">
                    {request.request_type} · {formatDate(request.created_at)}
                  </p>
                </div>
                <Badge variant={request.status === "active" ? "success" : "muted"}>
                  {request.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
