import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { InvitationActions } from "@/components/talent/InvitationActions";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function TalentOpportunitiesPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: invitations } = await supabase
    .from("request_invitations")
    .select("*, client_requests(title, request_type, summary)")
    .eq("talent_profile_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Opportunities</h1>

      {!invitations?.length ? (
        <EmptyState
          title="No invitations"
          description="Client requests matched to your skills will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {invitations.map((invitation) => {
            const request = invitation.client_requests as {
              title: string;
              request_type: string;
              summary: string | null;
            };
            return (
              <li key={invitation.id} className="card-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      {request.request_type} · {formatDate(invitation.created_at)}
                    </p>
                    {request.summary && (
                      <p className="mt-2 text-sm text-text-muted">{request.summary}</p>
                    )}
                  </div>
                  <Badge variant={invitation.status === "pending" ? "brand" : "muted"}>
                    {invitation.status}
                  </Badge>
                </div>
                <InvitationActions invitationId={invitation.id} status={invitation.status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
