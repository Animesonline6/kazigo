"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Briefcase, Flag, Bell, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface AdminNotificationItem {
  id: string;
  type: "novo_utilizador" | "novo_trabalho" | "nova_denuncia" | "sistema";
  title: string;
  description: string | null;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

const iconMap = {
  novo_utilizador: UserPlus,
  novo_trabalho: Briefcase,
  nova_denuncia: Flag,
  sistema: Bell,
};

const linkMap: Record<AdminNotificationItem["type"], (id: string) => string> = {
  novo_utilizador: () => "/admin/utilizadores",
  novo_trabalho: () => "/admin/trabalhos",
  nova_denuncia: () => "/admin/denuncias",
  sistema: () => "/admin",
};

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days} dia${days === 1 ? "" : "s"}`;
}

export function AdminNotificationsList({ initial }: { initial: AdminNotificationItem[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = items.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from("admin_notifications").update({ read: true }).eq("id", id);
    router.refresh();
  }

  async function markAllAsRead() {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);
    const unreadIds = items.filter((n) => !n.read).map((n) => n.id);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("admin_notifications").update({ read: true }).in("id", unreadIds);
    router.refresh();
    setMarkingAll(false);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Sem notificações administrativas"
        description="Novos utilizadores, trabalhos a aguardar aprovação e denúncias vão aparecer aqui."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={markingAll}>
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            Marcar todas como lidas
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <Link key={n.id} href={linkMap[n.type](n.related_id ?? "")} onClick={() => markAsRead(n.id)}>
              <Card
                className={cn(
                  "flex items-start gap-4 p-4",
                  !n.read && "border-teal-200 bg-teal-50/40"
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  {n.description && <p className="text-sm text-ink-faint">{n.description}</p>}
                  <p className="mt-1 text-xs text-ink-faint">{formatRelative(n.created_at)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Não lida" />}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
