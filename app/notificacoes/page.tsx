import { Briefcase, MessageSquare, Wallet, Star, Bell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

export const metadata = { title: "Notificações" };

const notifications: Notification[] = [
  { id: "n-1", userId: "u-1", type: "candidatura", title: "Candidatura aceite", description: "Sandra Muianga aceitou a tua candidatura.", read: false, createdAt: "2026-08-10T14:00:00.000Z" },
  { id: "n-2", userId: "u-1", type: "mensagem", title: "Nova mensagem", description: "Amélia Nhantumbo enviou-te uma mensagem.", read: false, createdAt: "2026-08-10T09:30:00.000Z" },
  { id: "n-3", userId: "u-1", type: "pagamento", title: "Pagamento recebido", description: "Recebeste 4 500 MT pelo trabalho concluído.", read: true, createdAt: "2026-08-08T12:00:00.000Z" },
  { id: "n-4", userId: "u-1", type: "avaliacao", title: "Nova avaliação", description: "Recebeste uma avaliação de 5 estrelas.", read: true, createdAt: "2026-08-06T08:00:00.000Z" },
];

const iconMap: Record<NotificationType, typeof Briefcase> = {
  candidatura: Briefcase,
  mensagem: MessageSquare,
  pagamento: Wallet,
  avaliacao: Star,
  sistema: Bell,
};

export default function NotificacoesPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Notificações</h1>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <Card key={n.id} className={n.read ? "flex items-start gap-4 p-4" : "flex items-start gap-4 border-teal-200 bg-teal-50/40 p-4"}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <p className="text-sm text-ink-faint">{n.description}</p>
                <p className="mt-1 text-xs text-ink-faint">{formatRelativeTime(n.createdAt)}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Não lida" />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
