import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTalentProfile } from "@/lib/profiles/helpers";
import { LogTimeForm } from "@/components/tasks/LogTimeForm";
import { SubmitWorkForm } from "@/components/tasks/SubmitWorkForm";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function TalentTaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const talentProfile = await getTalentProfile();
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("task_requests")
    .select("*, client_requests(title, description)")
    .eq("id", taskId)
    .eq("assigned_talent_id", talentProfile?.id ?? "")
    .single();

  if (!task) notFound();

  const request = task.client_requests as { title: string; description: string | null };

  const { data: milestones } = await supabase
    .from("task_milestones")
    .select("*")
    .eq("task_request_id", taskId)
    .order("created_at", { ascending: true });

  const { data: timeLogs } = await supabase
    .from("time_logs")
    .select("*")
    .eq("task_request_id", taskId)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/talent/tasks" className="text-sm text-brand hover:underline">
          ← Back to tasks
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">{request.title}</h1>
        <p className="mt-1 text-sm text-text-muted">
          {task.payment_type ?? "milestone"} · {formatDate(task.created_at)}
        </p>
      </div>

      <Badge variant={task.lifecycle_status === "active" ? "success" : "muted"}>
        {task.lifecycle_status}
      </Badge>

      {request.description && (
        <div className="card-surface p-6">
          <p className="whitespace-pre-wrap text-sm text-text-muted">{request.description}</p>
        </div>
      )}

      {milestones && milestones.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Milestones</h2>
          <ul className="space-y-3">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="card-surface p-4">
                <p className="font-medium text-text">{milestone.title}</p>
                <p className="text-sm text-text-muted">
                  {formatCurrency(milestone.amount_cents)} · {milestone.status}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {task.payment_type === "hourly" && <LogTimeForm taskId={taskId} />}

      {timeLogs && timeLogs.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-text">Time logs</h2>
          {timeLogs.map((log) => (
            <div key={log.id} className="card-surface p-3 text-sm">
              <p className="font-medium text-text">{log.hours}h</p>
              <p className="text-text-muted">{log.description}</p>
            </div>
          ))}
        </section>
      )}

      {["active", "talent_accepted", "revision_requested"].includes(task.lifecycle_status) && (
        <SubmitWorkForm taskId={taskId} />
      )}
    </div>
  );
}
