import { redirect } from "next/navigation";
import { MessagesApp, type ConversationSummary } from "@/components/messages/MessagesApp";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Mensagens" };
export const dynamic = "force-dynamic";

export default async function MensagensPage({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/mensagens");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, user_a, user_b, last_message_at")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  const convs = conversations ?? [];
  const otherIds = convs.map((c) => (c.user_a === user.id ? c.user_b : c.user_a));

  let profilesById: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
  if (otherIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", otherIds);
    profilesById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  }

  const conversationIds = convs.map((c) => c.id);
  let lastMessageByConv: Record<string, string> = {};
  let unreadByConv: Record<string, number> = {};

  if (conversationIds.length > 0) {
    const { data: allMessages } = await supabase
      .from("messages")
      .select("conversation_id, sender_id, content, read, created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true });

    for (const m of allMessages ?? []) {
      lastMessageByConv[m.conversation_id] = m.content;
      if (!m.read && m.sender_id !== user.id) {
        unreadByConv[m.conversation_id] = (unreadByConv[m.conversation_id] ?? 0) + 1;
      }
    }
  }

  const conversationSummaries: ConversationSummary[] = convs.map((c) => {
    const otherId = c.user_a === user.id ? c.user_b : c.user_a;
    const otherProfile = profilesById[otherId];
    return {
      id: c.id,
      otherUserId: otherId,
      otherUserName: otherProfile?.full_name || "Utilizador",
      otherUserAvatar: otherProfile?.avatar_url ?? null,
      lastMessage: lastMessageByConv[c.id] ?? null,
      lastMessageAt: c.last_message_at,
      unreadCount: unreadByConv[c.id] ?? 0,
    };
  });

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Mensagens</h1>
      <MessagesApp meId={user.id} initialConversations={conversationSummaries} initialSelectedId={searchParams.c ?? null} />
    </div>
  );
}
