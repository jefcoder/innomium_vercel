"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profiles/queries";

export async function sendMessage(threadId: string, body: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("messages").insert({
    thread_id: threadId,
    sender_id: profile.id,
    body,
  });

  await supabase
    .from("message_threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", threadId);

  revalidatePath("/client/messages");
  revalidatePath("/talent/messages");
  return { success: true };
}

export async function createThread(
  participantIds: string[],
  subject: string,
  threadType: string,
  referenceId?: string,
  initialMessage?: string
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const allParticipants = [...new Set([profile.id, ...participantIds])];

  const { data: thread } = await supabase
    .from("message_threads")
    .insert({
      subject,
      thread_type: threadType,
      reference_id: referenceId,
      participant_ids: allParticipants,
    })
    .select()
    .single();

  if (thread && initialMessage) {
    await supabase.from("messages").insert({
      thread_id: thread.id,
      sender_id: profile.id,
      body: initialMessage,
    });
  }

  return thread;
}

export async function getThreadsForUser(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("message_threads")
    .select("*")
    .contains("participant_ids", [userId])
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getMessagesForThread(threadId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, profiles:sender_id(display_name, full_name)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
