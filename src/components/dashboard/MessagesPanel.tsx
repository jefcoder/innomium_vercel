"use client";

import { useEffect, useState, useTransition } from "react";
import { sendMessage, getMessagesForThread } from "@/lib/messaging/actions";
import { createClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";

interface Thread {
  id: string;
  subject: string | null;
  thread_type: string;
  updated_at: string;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  profiles?: { display_name: string | null; full_name: string | null } | null;
}

interface MessagesPanelProps {
  threads: Thread[];
  initialMessages?: Message[];
  selectedThreadId?: string | null;
}

export function MessagesPanel({
  threads,
  initialMessages = [],
  selectedThreadId = null,
}: MessagesPanelProps) {
  const [activeThread, setActiveThread] = useState(selectedThreadId ?? threads[0]?.id ?? null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [, startTransition] = useTransition();
  const active = threads.find((t) => t.id === activeThread);

  useEffect(() => {
    if (!activeThread) return;

    startTransition(async () => {
      const data = await getMessagesForThread(activeThread);
      setMessages(data as Message[]);
    });

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${activeThread}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${activeThread}`,
        },
        async () => {
          const data = await getMessagesForThread(activeThread);
          setMessages(data as Message[]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeThread]);

  if (threads.length === 0) {
    return (
      <EmptyState
        title="No messages yet"
        description="Conversations with talents and Innomium will appear here."
      />
    );
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeThread || !body.trim()) return;
    await sendMessage(activeThread, body);
    setBody("");
    const data = await getMessagesForThread(activeThread);
    setMessages(data as Message[]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="card-surface divide-y divide-border p-0">
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            onClick={() => setActiveThread(thread.id)}
            className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
              activeThread === thread.id ? "bg-brand-soft text-brand-deep" : "hover:bg-surface-soft"
            }`}
          >
            <p className="font-medium">{thread.subject ?? "Conversation"}</p>
            <p className="text-xs text-text-muted">{formatDate(thread.updated_at)}</p>
          </button>
        ))}
      </aside>
      <section className="card-surface flex min-h-[360px] flex-col p-4">
        <h2 className="mb-4 font-semibold text-text">{active?.subject ?? "Messages"}</h2>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-text-muted">No messages in this thread yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="rounded-lg bg-surface-soft px-3 py-2 text-sm">
                <p className="font-medium text-text">
                  {msg.profiles?.display_name ?? msg.profiles?.full_name ?? "User"}
                </p>
                <p className="text-text-muted">{msg.body}</p>
                <p className="mt-1 text-xs text-text-soft">{formatDate(msg.created_at)}</p>
              </div>
            ))
          )}
        </div>
        {activeThread && (
          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <input
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Write a message…"
              className="flex-1 rounded-lg border border-border bg-bg-pure px-3 py-2 text-sm"
            />
            <Button type="submit" showArrow={false}>
              Send
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
