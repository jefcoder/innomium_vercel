import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ClientTalentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Browse talent</h1>
      <EmptyState
        title="Discover verified AI/ML talent"
        description="Browse public and limited profiles to find experts for your projects."
        action={<Button href="/talents">Browse talents</Button>}
      />
    </div>
  );
}
