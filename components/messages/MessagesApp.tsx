"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications/create";
import { cn } from "@/lib/utils";

export interface ConversationSummary {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageItem {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

export function MessagesApp({
  meId,
  initialConversations,
  initialSelectedId,
}: {
  meId: string;
  initialConversations: ConversationSummary[];
  initialSelectedId: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? initialConversations[0]?.id ?? null
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // Carrega mensagens da conversa selecionada + marca como lidas
  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setLoadingMessages(true);

    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });

      if (!active) return;
      setMessages(data ?? []);
      setLoadingMessages(false);

      // Marca como lidas as mensagens que não foram enviadas por mim
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", selectedId)
        .eq("read", false)
        .neq("sender_id", meId);

      setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c)));
    }

    load();

    const params = new URLSearchParams(searchParams.toString());
    params.set("c", selectedId);
    router.replace(`/mensagens?${params.toString()}`, { scroll: false });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Realtime: novas mensagens da conversa aberta aparecem sem recarregar
  useEffect(() => {
    if (!selectedId) return;

    const channel = supabase
      .channel(`messages-${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          const newMsg = payload.new as MessageItem;
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !selectedId || sending) return;

    setSending(true);
    setDraft("");

    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: selectedId, sender_id: meId, content })
      .select("id, sender_id, content, created_at")
      .single();

    if (!error && data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
      setConversations((prev) =>
        prev
          .map((c) => (c.id === selectedId ? { ...c, lastMessage: content, lastMessageAt: data.created_at } : c))
          .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      );

      if (selected) {
        createNotification(supabase, {
          userId: selected.otherUserId,
          type: "mensagem",
          title: "Nova mensagem",
          description: content.length > 80 ? `${content.slice(0, 80)}...` : content,
        });
      }
    }

    setSending(false);
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Ainda não tens conversas"
        description="Quando enviares ou receberes uma mensagem sobre um trabalho, aparece aqui."
      />
    );
  }

  return (
    <div className="grid overflow-hidden rounded-md border border-border bg-white lg:grid-cols-[300px_1fr]">
      <div className="flex max-h-[560px] flex-col divide-y divide-border overflow-y-auto border-b border-border lg:border-b-0 lg:border-r">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedId(conv.id)}
            className={cn(
              "flex items-center gap-3 p-4 text-left hover:bg-surface-subtle",
              selectedId === conv.id && "bg-teal-50"
            )}
          >
            <Avatar name={conv.otherUserName} src={conv.otherUserAvatar ?? undefined} size="md" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-ink">{conv.otherUserName}</p>
              <p className="truncate text-xs text-ink-faint">{conv.lastMessage || "Sem mensagens ainda"}</p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                {conv.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex h-[560px] flex-col">
        {selected ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar name={selected.otherUserName} src={selected.otherUserAvatar ?? undefined} size="sm" />
              <p className="text-sm font-semibold text-ink">{selected.otherUserName}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMessages ? (
                <p className="text-center text-xs text-ink-faint">A carregar...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-xs text-ink-faint">Diz olá para começar a conversa.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.sender_id === meId ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-xs rounded-md p-3 text-sm",
                        m.sender_id === meId
                          ? "rounded-tr-none bg-teal-500 text-white"
                          : "rounded-tl-none bg-surface-subtle text-ink"
                      )}
                    >
                      {m.content}
                      <p className={cn("mt-1 text-[10px]", m.sender_id === meId ? "text-teal-50" : "text-ink-faint")}>
                        {formatTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <form className="flex items-center gap-2 border-t border-border p-3" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Escreve uma mensagem..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="flex-1 rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                aria-label="Enviar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-ink-faint">
            Escolhe uma conversa para veres as mensagens.
          </div>
        )}
      </div>
    </div>
  );
}
