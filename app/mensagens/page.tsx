"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { workers } from "@/data/mock";

const conversations = workers.slice(0, 4).map((w, i) => ({
  id: `conv-${i}`,
  worker: w,
  lastMessage: i === 0 ? "Olá! Ainda está disponível para o trabalho?" : "Obrigado pela informação.",
  unread: i === 0,
}));

export default function MensagensPage() {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Mensagens</h1>

      <div className="grid overflow-hidden rounded-md border border-border bg-white lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col divide-y divide-border border-b border-border lg:border-b-0 lg:border-r">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "flex items-center gap-3 p-4 text-left hover:bg-surface-subtle",
                activeId === conv.id && "bg-teal-50"
              )}
            >
              <Avatar name={conv.worker.name} size="md" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-ink">{conv.worker.name}</p>
                <p className="truncate text-xs text-ink-faint">{conv.lastMessage}</p>
              </div>
              {conv.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Não lida" />}
            </button>
          ))}
        </div>

        <div className="flex h-[480px] flex-col">
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Avatar name={active.worker.name} size="sm" />
                <p className="text-sm font-semibold text-ink">{active.worker.name}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                <div className="max-w-xs rounded-md rounded-tl-none bg-surface-subtle p-3 text-sm text-ink">
                  {active.lastMessage}
                </div>
              </div>
              <form className="flex items-center gap-2 border-t border-border p-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Escreve uma mensagem..."
                  className="h-11 flex-1 rounded-sm border border-border px-3.5 text-sm focus:border-teal-500"
                  aria-label="Escreve uma mensagem"
                />
                <button
                  type="submit"
                  aria-label="Enviar mensagem"
                  className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-700 text-white hover:bg-navy-600"
                >
                  <Send className="h-[18px] w-[18px]" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-faint">
              Seleciona uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
