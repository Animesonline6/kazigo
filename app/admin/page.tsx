import Link from "next/link";
import { Users, Briefcase, FileCheck2, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Administração" };
export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    { count: totalUsers },
    { count: activeJobs },
    { count: totalApplications },
    { count: usersThisMonth },
    { count: usersLastMonth },
    { data: recentJobs },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "aberto"),
    supabase.from("job_applications").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", startOfThisMonth),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lt("created_at", startOfThisMonth),
    supabase
      .from("jobs")
      .select("id, title, city, status, client_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  let growthLabel = "—";
  if (usersLastMonth && usersLastMonth > 0) {
    const growth = (((usersThisMonth ?? 0) - usersLastMonth) / usersLastMonth) * 100;
    growthLabel = `${growth >= 0 ? "+" : ""}${growth.toFixed(0)}%`;
  } else if ((usersThisMonth ?? 0) > 0) {
    growthLabel = `+${usersThisMonth} este mês`;
  }

  const jobs = recentJobs ?? [];
  const clientIds = [...new Set(jobs.map((j) => j.client_id))];
  let clientsById: Record<string, any> = {};
  if (clientIds.length > 0) {
    const { data: clients } = await supabase.from("profiles").select("id, full_name").in("id", clientIds);
    clientsById = Object.fromEntries((clients ?? []).map((c) => [c.id, c]));
  }

  const stats = [
    { icon: Users, label: "Utilizadores registados", value: (totalUsers ?? 0).toLocaleString("pt-PT") },
    { icon: Briefcase, label: "Trabalhos ativos", value: (activeJobs ?? 0).toLocaleString("pt-PT") },
    { icon: FileCheck2, label: "Candidaturas totais", value: (totalApplications ?? 0).toLocaleString("pt-PT") },
    { icon: TrendingUp, label: "Novos utilizadores (mês)", value: growthLabel },
  ];

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Administração</h1>
        <p className="mt-1 text-sm text-ink-faint">Visão geral da plataforma KaziGo.</p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-2 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
              <stat.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <p className="text-xl font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-faint">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Link href="/admin/utilizadores" className="mb-10 block">
        <Card className="flex items-center justify-between p-5 hover:border-teal-500/60">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-teal-50 text-teal-700">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Gerir utilizadores</p>
              <p className="text-xs text-ink-faint">Ver, pesquisar e suspender contas</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
        </Card>
      </Link>

      <h2 className="mb-4 text-lg font-semibold">Trabalhos recentes</h2>
      {jobs.length === 0 ? (
        <p className="text-sm text-ink-faint">Ainda não há trabalhos publicados na plataforma.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-subtle text-left text-xs uppercase text-ink-faint">
              <tr>
                <th className="p-4 font-medium">Título</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Localização</th>
                <th className="p-4 font-medium">Publicado</th>
                <th className="p-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="p-4 font-medium text-ink">{job.title}</td>
                  <td className="p-4 text-ink-faint">{clientsById[job.client_id]?.full_name ?? "—"}</td>
                  <td className="p-4 text-ink-faint">{job.city ?? "Remoto"}</td>
                  <td className="p-4 text-ink-faint">{formatDate(job.created_at)}</td>
                  <td className="p-4">
                    <Badge tone={job.status === "aberto" ? "success" : "neutral"}>{job.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-xs text-ink-faint">
        Denúncias ainda não estão disponíveis nesta área — vêm numa próxima atualização.
      </p>
    </div>
  );
}
