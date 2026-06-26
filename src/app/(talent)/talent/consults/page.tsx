import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { NdaAcceptButton } from "@/components/proprietary/NdaAcceptButton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function TalentConsultsPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const [{ data: consults }, { data: proprietary }] = await Promise.all([
    supabase
      .from("consult_requests")
      .select("*, client_requests(title)")
      .eq("selected_talent_id", talentProfile?.id ?? "")
      .order("created_at", { ascending: false }),
    supabase
      .from("proprietary_consult_requests")
      .select("*, client_requests(title)")
      .in("lifecycle_status", ["matching", "open"])
      .order("created_at", { ascending: false }),
  ]);

  const hasAny = (consults?.length ?? 0) + (proprietary?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Consults</h1>

      {!hasAny ? (
        <EmptyState
          title="No consult engagements"
          description="Accepted consult requests will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {consults?.map((consult) => {
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
          {proprietary?.map((item) => {
            const request = item.client_requests as { title: string };
            return (
              <li key={item.id} className="card-surface space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      Proprietary · {item.disclosure_stage} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Badge variant="warning">{item.lifecycle_status}</Badge>
                </div>
                {item.disclosure_stage === "pre_nda" && (
                  <NdaAcceptButton proprietaryConsultId={item.id} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
