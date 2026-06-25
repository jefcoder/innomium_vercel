import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminMatchingPage() {
  const supabase = await createClient();

  const { data: invitations } = await supabase
    .from("request_invitations")
    .select("*, client_requests(title, request_type), talent_profiles(professional_headline)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Matching</h1>
      <p className="text-sm text-text-muted">
        Review talent invitations and client request match activity.
      </p>

      {!invitations?.length ? (
        <EmptyState title="No match activity" description="Request invitations will appear here." />
      ) : (
        <ul className="space-y-3">
          {invitations.map((invitation) => {
            const request = invitation.client_requests as { title: string; request_type: string };
            const talent = invitation.talent_profiles as { professional_headline: string | null } | null;
            return (
              <li key={invitation.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{request.title}</p>
                  <p className="text-sm text-text-muted">
                    {talent?.professional_headline ?? "Talent"} · {request.request_type} ·{" "}
                    {formatDate(invitation.created_at)}
                  </p>
                </div>
                <Badge variant="brand">{invitation.status}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
