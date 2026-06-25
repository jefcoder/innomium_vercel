import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientProfile } from "@/lib/profiles/helpers";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientTaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const clientProfile = await getClientProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("task_requests")
    .select("*, client_requests!inner(title, description, client_profile_id)")
    .eq("id", taskId)
    .eq("client_requests.client_profile_id", clientProfile?.id ?? "")
    .single();

  if (!task) notFound();

  const request = task.client_requests as { title: string; description: string | null };

  const { data: milestones } = await supabase
    .from("task_milestones")
    .select("*")
    .eq("task_request_id", taskId)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/client/tasks" className="text-sm text-brand hover:underline">
          ← Back to tasks
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{request.title}</h1>
        <p className="mt-1 text-sm text-text-muted">
          {task.payment_type ?? "milestone"} · {formatDate(task.created_at)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={task.lifecycle_status === "active" ? "success" : "muted"}>
          {task.lifecycle_status}
        </Badge>
      </div>

      {request.description && (
        <div className="card-surface p-6">
          <p className="whitespace-pre-wrap text-sm text-text-muted">{request.description}</p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Milestones</h2>
        {!milestones?.length ? (
          <EmptyState title="No milestones" description="Add milestones to track deliverables." />
        ) : (
          <ul className="space-y-3">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="card-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-text">{milestone.title}</p>
                  <Badge variant="muted">{milestone.status}</Badge>
                </div>
                {milestone.deliverable && (
                  <p className="mt-1 text-sm text-text-muted">{milestone.deliverable}</p>
                )}
                <p className="mt-2 text-sm font-medium text-text">
                  {formatCurrency(milestone.amount_cents)}
                  {milestone.due_at && ` · Due ${formatDate(milestone.due_at)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
