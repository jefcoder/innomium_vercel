import {
  listMatchableRequests,
  listMatchableTalents,
  listRecentInvitations,
} from "@/lib/requests/queries";
import { MatchingPanel } from "@/components/admin/MatchingPanel";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function AdminMatchingPage() {
  const [requests, talents, invitations] = await Promise.all([
    listMatchableRequests(),
    listMatchableTalents(),
    listRecentInvitations(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Matching</h1>
      <p className="text-sm text-text-muted">
        Invite verified talent to client requests.
      </p>

      {requests.length === 0 || talents.length === 0 ? (
        <EmptyState
          title="Cannot match yet"
          description={
            requests.length === 0
              ? "No submitted client requests available for matching."
              : "No verified talent profiles available."
          }
        />
      ) : (
        <MatchingPanel requests={requests} talents={talents} invitations={invitations} />
      )}
    </div>
  );
}
