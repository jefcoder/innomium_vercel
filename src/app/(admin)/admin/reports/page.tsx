import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Reports</h1>

      {!reports?.length ? (
        <EmptyState title="No reports" description="User reports will appear here for moderation." />
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="card-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-text">{report.category}</p>
                <Badge variant={report.status === "submitted" ? "warning" : "muted"}>
                  {report.status}
                </Badge>
              </div>
              {report.description && (
                <p className="mt-2 text-sm text-text-muted">{report.description}</p>
              )}
              <p className="mt-2 text-xs text-text-soft">{formatDate(report.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
