import { createClient } from "@/lib/supabase/server";
import { DisputeResolutionForm } from "@/components/admin/DisputeResolutionForm";
import { EmptyState } from "@/components/dashboard/EmptyState";

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
              <DisputeResolutionForm key={task.id} taskId={task.id} taskTitle={request.title} />
            );
          })}
        </ul>
      )}
    </div>
  );
}
