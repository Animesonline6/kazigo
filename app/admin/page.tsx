import {
  Users,
  UserCheck,
  Radio,
  Briefcase,
  Clock3,
  FileCheck2,
  ListChecks,
  CheckCircle2,
  Flag,
  Wallet,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { UsersChart } from "@/components/admin/UsersChart";
import { JobsChart } from "@/components/admin/JobsChart";
import { CategoriesChart } from "@/components/admin/CategoriesChart";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getDashboardStats } from "@/lib/admin/queries";

export const metadata = { title: "Dashboard — Administração" };
export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

function growth(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

export default async function AdminDashboardPage() {
  const { supabase, profile } = await requireAdmin();

  const stats = await getDashboardStats(supabase);

  const { data: recentJobs } = await supabase
    .from("jobs")
    .select("id, title, city, status, client_id, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const jobs = recentJobs ?? [];
  const clientIds = [...new Set(jobs.map((j) => j.client_id))];
  let clientsById: Record<string, any> = {};
  if (clientIds.length > 0) {
    const { data: clients } = await supabase.from("profiles").select("id, full_name").in("id", clientIds);
    clientsById = Object.fromEntries((clients ?? []).map((c) => [c.id, c]));
  }

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-faint">Visão geral em tempo real da plataforma KaziGo.</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Utilizadores registados" value={stats.totalUsers} />
        <StatCard
          icon={UserCheck}
          label="Utilizadores ativos hoje"
          unavailable
          unavailableReason="Precisa de registo de sessões (last_sign_in_at)"
        />
        <StatCard
          icon={Radio}
          label="Utilizadores online"
          unavailable
          unavailableReason="Precisa de presença em tempo real (Supabase Realtime)"
        />
        <StatCard icon={Briefcase} label="Trabalhos publicados" value={stats.totalJobs} />
        <StatCard
          icon={Clock3}
          label="Trabalhos pendentes de aprovação"
          value={stats.pendingApproval}
        />
        <StatCard icon={FileCheck2} label="Candidaturas totais" value={stats.totalApplications} />
        <StatCard icon={ListChecks} label="Candidaturas pendentes" value={stats.pendingApplications} />
        <StatCard icon={CheckCircle2} label="Trabalhos concluídos" value={stats.completedJobs} />
        <StatCard
          icon={Flag}
          label="Denúncias pendentes"
          value={stats.pendingReports}
        />
        <StatCard
          icon={Wallet}
          label="Valor movimentado"
          unavailable
          unavailableReason="Precisa do sistema de pagamentos (Fase 4)"
        />
        <StatCard
          icon={TrendingUp}
          label="Novos utilizadores (mês)"
          value={stats.usersThisMonth}
          growthPercent={growth(stats.usersThisMonth, stats.usersLastMonth)}
        />
        <StatCard
          icon={BarChart3}
          label="Crescimento de trabalhos"
          value={stats.jobsThisMonth}
          growthPercent={growth(stats.jobsThisMonth, stats.jobsLastMonth)}
        />
      </div>

      {/* Gráficos */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <UsersChart />
        </div>
        <JobsChart />
        <CategoriesChart />
      </div>

      {/* Trabalhos recentes */}
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
    </AdminLayout>
  );
}
