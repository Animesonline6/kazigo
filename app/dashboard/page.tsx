import Link from "next/link";
import { Briefcase, MessageSquare, Star, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobs } from "@/data/mock";

export const metadata = { title: "Painel" };

const stats = [
  { icon: Briefcase, label: "Candidaturas ativas", value: "3" },
  { icon: MessageSquare, label: "Mensagens novas", value: "5" },
  { icon: Star, label: "Avaliação média", value: "4.8" },
  { icon: Wallet, label: "Ganhos este mês", value: "12 400 MT" },
];

export default function DashboardPage() {
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">O teu painel</h1>
        <p className="mt-1 text-sm text-ink-faint">Resumo da tua atividade na KaziGo.</p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-2 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-teal-50 text-teal-600">
              <stat.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <p className="text-xl font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-faint">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Trabalhos recomendados para ti</h2>
        <Link href="/trabalhos" className="text-sm font-semibold text-navy-700 hover:text-teal-600">
          Ver todos
        </Link>
      </div>

      {recentJobs.length === 0 ? (
        <EmptyState title="Ainda sem recomendações" description="Completa o teu perfil para receberes sugestões de trabalhos." />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-md border border-border bg-white">
          {recentJobs.map((job) => (
            <Link key={job.id} href={`/trabalhos/${job.id}`} className="flex items-center justify-between gap-4 p-5 hover:bg-surface-subtle">
              <div>
                <p className="text-sm font-semibold text-ink">{job.title}</p>
                <p className="text-xs text-ink-faint">{job.location.city} · {job.applicantsCount} candidaturas</p>
              </div>
              <Badge tone="teal">Novo</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
