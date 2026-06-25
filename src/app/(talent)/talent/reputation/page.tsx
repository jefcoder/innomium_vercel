import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDate } from "@/lib/utils";

export default async function TalentReputationPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("reputation_events")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: talentProfile } = await supabase
    .from("talent_profiles")
    .select("reputation_overall, reputation_consulting, reputation_tasks, reputation_competitions")
    .eq("user_id", profile.id)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Reputation</h1>

      {talentProfile && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Overall", value: talentProfile.reputation_overall },
            { label: "Consulting", value: talentProfile.reputation_consulting },
            { label: "Tasks", value: talentProfile.reputation_tasks },
            { label: "Competitions", value: talentProfile.reputation_competitions },
          ].map((item) => (
            <div key={item.label} className="card-surface p-4">
              <p className="text-sm text-text-muted">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-text">{Number(item.value).toFixed(1)}</p>
            </div>
          ))}
        </div>
      )}

      {!events?.length ? (
        <EmptyState
          title="No reputation events"
          description="Completed engagements and reviews will build your reputation over time."
        />
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="card-surface flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <span className="text-text">
                {event.event_type}
                {event.dimension && ` · ${event.dimension}`}
              </span>
              <span className={event.delta >= 0 ? "text-green-600" : "text-red-600"}>
                {event.delta >= 0 ? "+" : ""}
                {event.delta}
              </span>
              <span className="w-full text-xs text-text-muted">{formatDate(event.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
