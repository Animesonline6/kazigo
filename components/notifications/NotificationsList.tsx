"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, MessageSquare, Wallet, Star, Bell, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export interface NotificationItem {
  id: string;
  type: "candidatura" | "mensagem" | "pagamento" | "avaliacao" | "sistema";
  title: string;
  description: string | null;
  related_job_id: string | null;
  read: boolean;
  created_at: string;
}

const iconMap: Record<NotificationItem["type"], typeof Briefcase> = {
  candidatura: Briefcase,
  mensagem: MessageSquare,
  pagamento: Wallet,
  avaliacao: Star,
  sistema: Bell,
};

export function NotificationsList({ initialNotifications }: { initialNotifications: NotificationItem[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    router.refresh();
  }

  async function markAllAsRead() {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    router.refresh();
    setMarkingAll(false);
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Sem notificações"
        description="Quando houver novidades sobre candidaturas, avaliações ou trabalhos, aparecem aqui."
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
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          const content = (
            <Card
              className={n.read ? "flex items-start gap-4 p-4" : "flex items-start gap-4 border-teal-200 bg-teal-50/40 p-4"}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                {n.description && <p className="text-sm text-ink-faint">{n.description}</p>}
                <p className="mt-1 text-xs text-ink-faint">{formatRelativeTime(n.created_at)}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Não lida" />}
            </Card>
          );

          return n.related_job_id ? (
            <Link key={n.id} href={`/trabalhos/${n.related_job_id}`} onClick={() => markAsRead(n.id)}>
              {content}
            </Link>
          ) : (
            <button key={n.id} type="button" onClick={() => markAsRead(n.id)} className="text-left">
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
