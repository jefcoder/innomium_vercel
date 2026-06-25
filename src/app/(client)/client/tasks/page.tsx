import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function ClientTasksPage() {
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("task_requests")
    .select("*, client_requests!inner(id, title, client_profile_id)")
    .eq("client_requests.client_profile_id", clientProfile?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Tasks</h1>
        <Button href="/client/tasks/new">New task</Button>
      </div>

      {!tasks?.length ? (
        <EmptyState
          title="No tasks yet"
          description="Create milestone-based or hourly tasks for verified talent."
          action={<Button href="/client/tasks/new">Create task</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const request = task.client_requests as { id: string; title: string };
            return (
              <li key={task.id}>
                <Link
                  href={`/client/tasks/${task.id}`}
                  className="card-surface flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-text">{request.title}</p>
                    <p className="text-sm text-text-muted">
                      {task.payment_type ?? "milestone"} · {formatDate(task.created_at)}
                    </p>
                  </div>
                  <Badge variant={task.lifecycle_status === "active" ? "success" : "muted"}>
                    {task.lifecycle_status}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
