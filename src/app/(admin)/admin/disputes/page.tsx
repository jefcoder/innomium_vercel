import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminDisputesPage() {
  const supabase = await createClient();

  const { data: disputes } = await supabase
    .from("task_requests")
    .select("*, client_requests(title)")
    .eq("lifecycle_status", "disputed")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Disputes</h1>

      {!disputes?.length ? (
        <EmptyState title="No open disputes" description="Disputed tasks will appear here for resolution." />
      ) : (
        <ul className="space-y-3">
          {disputes.map((task) => {
            const request = task.client_requests as { title: string };
            return (
              <li key={task.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-text">{request.title}</p>
                  <p className="text-sm text-text-muted">Updated {formatDate(task.updated_at)}</p>
                </div>
                <Badge variant="warning">disputed</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
