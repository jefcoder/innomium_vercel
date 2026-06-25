import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Users</h1>

      {!users?.length ? (
        <EmptyState title="No users" description="Registered users will appear here." />
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-text">
                  {user.display_name ?? user.full_name ?? "User"}
                </p>
                <p className="text-sm text-text-muted">{formatDate(user.created_at)}</p>
              </div>
              <Badge variant={user.account_type === "admin" ? "brand" : "muted"}>
                {user.account_type}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
