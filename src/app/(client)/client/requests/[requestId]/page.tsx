import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("client_requests")
    .select("*")
    .eq("id", requestId)
    .eq("client_profile_id", clientProfile?.id ?? "")
    .single();

  if (!request) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/client/requests" className="text-sm text-brand hover:underline">
            ← Back to requests
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-text">{request.title}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {request.request_type} · Created {formatDate(request.created_at)}
          </p>
        </div>
        <Badge variant={request.status === "active" ? "success" : "muted"}>
          {request.status}
        </Badge>
      </div>

      <div className="card-surface space-y-4 p-6">
        {request.summary && (
          <div>
            <h2 className="text-sm font-semibold text-text">Summary</h2>
            <p className="mt-1 text-sm text-text-muted">{request.summary}</p>
          </div>
        )}
        {request.description && (
          <div>
            <h2 className="text-sm font-semibold text-text">Description</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-text-muted">
              {request.description}
            </p>
          </div>
        )}
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {request.domain && (
            <>
              <dt className="text-text-muted">Domain</dt>
              <dd className="text-text">{request.domain}</dd>
            </>
          )}
          {request.budget_cents != null && (
            <>
              <dt className="text-text-muted">Budget</dt>
              <dd className="text-text">{formatCurrency(request.budget_cents)}</dd>
            </>
          )}
          <dt className="text-text-muted">Visibility</dt>
          <dd className="text-text">{request.visibility}</dd>
        </dl>
      </div>

      <Button href="/client/messages" variant="secondary">
        Message Innomium
      </Button>
    </div>
  );
}
