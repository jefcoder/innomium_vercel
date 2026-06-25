import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function TalentTasksPage() {
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("task_requests")
    .select("*, client_requests(title)")
    .eq("assigned_talent_id", talentProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Tasks</h1>

      {!tasks?.length ? (
        <EmptyState
          title="No assigned tasks"
          description="Tasks you accept from clients will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const request = task.client_requests as { title: string };
            return (
              <li key={task.id}>
                <div className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      {task.payment_type ?? "milestone"} · {formatDate(task.created_at)}
                    </p>
                  </div>
                  <Badge variant={task.lifecycle_status === "active" ? "success" : "muted"}>
                    {task.lifecycle_status}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
