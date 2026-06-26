"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteTalentToRequest } from "@/lib/requests/actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface RequestOption {
  id: string;
  title: string;
  request_type: string;
  status: string;
  domain: string | null;
}

interface TalentOption {
  id: string;
  professional_headline: string | null;
  profiles: { full_name: string | null; display_name: string | null } | { full_name: string | null; display_name: string | null }[] | null;
}

interface InvitationRow {
  id: string;
  status: string;
  created_at: string;
  client_requests: { title: string; request_type: string } | null;
  talent_profiles: { professional_headline: string | null } | null;
}

interface MatchingPanelProps {
  requests: RequestOption[];
  talents: TalentOption[];
  invitations: InvitationRow[];
}

export function MatchingPanel({ requests, talents, invitations }: MatchingPanelProps) {
  const router = useRouter();
  const [requestId, setRequestId] = useState(requests[0]?.id ?? "");
  const [talentId, setTalentId] = useState(talents[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleInvite() {
    if (!requestId || !talentId) return;
    setPending(true);
    setMessage(null);
    const result = await inviteTalentToRequest(requestId, talentId, notes || undefined);
    if (result.success) {
      setMessage("Invitation sent.");
      setNotes("");
      router.refresh();
    } else {
      setMessage(result.error ?? "Failed to send invitation.");
    }
    setPending(false);
  }

  return (
    <div className="space-y-8">
      <div className="card-surface space-y-4 p-6">
        <h2 className="text-lg font-semibold text-text">Send invitation</h2>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Client request</span>
          <select
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            className="field-input"
          >
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.request_type}) — {r.status}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Talent</span>
          <select
            value={talentId}
            onChange={(e) => setTalentId(e.target.value)}
            className="field-input"
          >
            {talents.map((t) => {
              const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
              const name =
                profile?.display_name ?? profile?.full_name ?? "Talent";
              return (
                <option key={t.id} value={t.id}>
                  {name}
                  {t.professional_headline ? ` — ${t.professional_headline}` : ""}
                </option>
              );
            })}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-text">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="field-input"
          />
        </label>
        {message && <p className="text-sm text-brand">{message}</p>}
        <Button type="button" showArrow={false} disabled={pending || !requestId || !talentId} onClick={handleInvite}>
          Send invitation
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Recent invitations</h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-text-muted">No invitations yet.</p>
        ) : (
          <ul className="space-y-3">
            {invitations.map((invitation) => (
              <li
                key={invitation.id}
                className="card-surface flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="font-medium text-text">
                    {invitation.client_requests?.title ?? "Request"}
                  </p>
                  <p className="text-sm text-text-muted">
                    {invitation.talent_profiles?.professional_headline ?? "Talent"} ·{" "}
                    {invitation.client_requests?.request_type} ·{" "}
                    {formatDate(invitation.created_at)}
                  </p>
                </div>
                <Badge variant="brand">{invitation.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
