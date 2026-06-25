import { requireProfile } from "@/lib/profiles/queries";
import { getThreadsForUser } from "@/lib/messaging/actions";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";

export default async function ClientMessagesPage() {
  const profile = await requireProfile();
  const threads = await getThreadsForUser(profile.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Messages</h1>
      <MessagesPanel threads={threads} />
    </div>
  );
}
