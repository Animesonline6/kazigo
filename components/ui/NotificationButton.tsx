"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Ícone de notificações do cabeçalho.
 *
 * Tenta ler uma contagem real de notificações não lidas a partir de uma
 * tabela "notifications" (user_id, read). Essa tabela ainda não existe no
 * schema atual do KaziGo — por isso, se a query falhar (tabela em falta),
 * o indicador simplesmente não aparece, em vez de mostrar um número falso.
 */
export function NotificationButton({ userId }: { userId: string }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadUnread() {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (!active) return;
      if (error) {
        // Tabela ainda não existe ou outra falha silenciosa — sem dados falsos.
        setUnreadCount(null);
        return;
      }
      setUnreadCount(count ?? 0);
    }

    loadUnread();
    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <Link
      href="/notificacoes"
      aria-label={
        unreadCount && unreadCount > 0
          ? `Notificações, ${unreadCount} por ler`
          : "Notificações"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-surface-muted"
    >
      <Bell className="h-5 w-5" aria-hidden="true" />
      {!!unreadCount && unreadCount > 0 && (
        <span
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
