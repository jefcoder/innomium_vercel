import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function TalentConsultsPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: consults } = await supabase
    .from("consult_requests")
    .select("*, client_requests(title)")
    .eq("selected_talent_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Consults</h1>

      {!consults?.length ? (
        <EmptyState
          title="No consult engagements"
          description="Accepted consult requests will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {consults.map((consult) => {
            const request = consult.client_requests as { title: string };
            return (
              <li key={consult.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{request.title}</p>
                  <p className="text-sm text-text-muted">
                    {consult.consult_type ?? "mentor"} · {formatDate(consult.created_at)}
                  </p>
                </div>
                <Badge variant="brand">{consult.lifecycle_status}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
