import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Heart,
  MessageSquare,
  Plus,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  CheckCircle,
  FileCheck2,
  Star,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatsCard } from "@/components/ui/StatsCard";
import { QuickAction } from "@/components/ui/QuickAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { JobStatusBadge } from "@/components/marketplace/atoms";
import { RecommendedJobCard } from "@/components/dashboard/RecommendedJobCard";
import { createClient } from "@/lib/supabase/server";
import type { JobStatus } from "@/types";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  worker: "Trabalhador",
  client: "Cliente",
  company: "Empresa",
  admin: "Administrador",
};

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return "A combinar";
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MTn`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoje";
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, city, avatar_url, verified")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  const firstName = profile.full_name?.split(" ")[0] || profile.full_name;

  // Toda a conta pode publicar trabalhos E candidatar-se, ao mesmo
  // tempo — por isso ambos os blocos abaixo são sempre calculados,
  // independentemente do "role" com que a conta foi criada.

  // ============================================================
  // Como CLIENTE — trabalhos que esta conta publicou
  // ============================================================
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, category, city, remote, budget_min, budget_max, applications_count, created_at")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const myJobs = jobs ?? [];
  const clientStats = {
    publicados: myJobs.length,
    emAndamento: myJobs.filter((j) => j.status === "em_andamento").length,
    concluidos: myJobs.filter((j) => j.status === "concluido").length,
    candidaturasRecebidas: 0,
  };

  const jobIds = myJobs.map((j) => j.id);
  if (jobIds.length > 0) {
    const { count } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .in("job_id", jobIds);
    clientStats.candidaturasRecebidas = count ?? 0;
  }

  // ============================================================
  // Como TRABALHADOR — candidaturas enviadas por esta conta
  // ============================================================
  // Garante que a conta tem um registo em worker_profiles, mesmo
  // que não tenha sido criada originalmente como "worker".
  await supabase.from("worker_profiles").upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });

  const { data: applications } = await supabase
    .from("job_applications")
    .select("id, job_id, status, jobs(status)")
    .eq("worker_id", user.id);

  const apps = applications ?? [];
  const workerStats = {
    enviadas: apps.length,
    emAndamento: apps.filter((a: any) => a.status === "aceite" && a.jobs?.status === "em_andamento").length,
    concluidos: apps.filter((a: any) => a.status === "aceite" && a.jobs?.status === "concluido").length,
    avaliacoes: 0,
  };

  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("rating, reviews_count")
    .eq("id", user.id)
    .single();

  workerStats.avaliacoes = workerProfile?.reviews_count ?? 0;

  const appliedJobIds = apps.map((a: any) => a.job_id);
  let jobsQuery = supabase
    .from("jobs")
    .select("id, title, category, city, remote, budget_min, budget_max, created_at")
    .eq("status", "aberto")
    .neq("client_id", user.id) // não recomenda os teus próprios trabalhos
    .order("created_at", { ascending: false })
    .limit(4);

  if (appliedJobIds.length > 0) {
    jobsQuery = jobsQuery.not("id", "in", `(${appliedJobIds.join(",")})`);
  }

  const { data: recommended } = await jobsQuery;
  const recommendedJobs = recommended ?? [];

  let favoritedJobIds = new Set<string>();
  if (recommendedJobs.length > 0) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("job_id")
      .eq("user_id", user.id)
      .in(
        "job_id",
        recommendedJobs.map((j) => j.id)
      );
    favoritedJobIds = new Set((favorites ?? []).map((f) => f.job_id));
  }

  return (
    <div className="container-kazigo py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Bem-vindo de volta, {firstName}</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Aqui está um resumo da tua atividade na KaziGo — como cliente e como trabalhador.
        </p>
      </div>

      {/* Cartão do utilizador */}
      <Card className="mb-6 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={profile.full_name} src={profile.avatar_url ?? undefined} size="lg" />
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-ink sm:text-lg">{profile.full_name}</h2>
              <p className="text-sm text-ink-faint">{profile.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge tone="navy">{roleLabel[profile.role] ?? profile.role}</Badge>
                {profile.city && (
                  <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {profile.city}
                  </span>
                )}
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Email verificado
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link href="/perfil#editar-perfil" className="shrink-0">
            <Button variant="outline" size="sm">
              Editar perfil
            </Button>
          </Link>
        </div>
      </Card>

      {/* Ações rápidas */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-ink">Ações rápidas</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <QuickAction href="/trabalhos/publicar" label="Publicar trabalho" icon={Plus} />
          <QuickAction href="/candidaturas" label="Minhas candidaturas" icon={FileCheck2} />
          <QuickAction href="/trabalhos" label="Ver trabalhos" icon={Briefcase} />
          <QuickAction href="/favoritos" label="Favoritos" icon={Heart} />
          <QuickAction href="/mensagens" label="Mensagens" icon={MessageSquare} />
        </div>
      </div>

      {/* Estatísticas — como cliente */}
      <h3 className="mb-3 text-sm font-semibold text-ink">Como cliente</h3>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatsCard label="Trabalhos publicados" value={clientStats.publicados} icon={Briefcase} tone="navy" />
        <StatsCard label="Em andamento" value={clientStats.emAndamento} icon={Clock} tone="teal" />
        <StatsCard label="Concluídos" value={clientStats.concluidos} icon={CheckCircle} tone="neutral" />
        <StatsCard label="Candidaturas recebidas" value={clientStats.candidaturasRecebidas} icon={Users} tone="orange" />
      </div>

      {/* Estatísticas — como trabalhador */}
      <h3 className="mb-3 text-sm font-semibold text-ink">Como trabalhador</h3>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatsCard label="Candidaturas enviadas" value={workerStats.enviadas} icon={Send} tone="navy" />
        <StatsCard label="Em andamento" value={workerStats.emAndamento} icon={Clock} tone="teal" />
        <StatsCard label="Concluídos" value={workerStats.concluidos} icon={FileCheck2} tone="neutral" />
        <StatsCard label="Avaliações" value={workerStats.avaliacoes} icon={Star} tone="orange" />
      </div>

      {/* Meus trabalhos publicados */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Meus trabalhos publicados</h3>
          {myJobs.length > 0 && (
            <Link href="/trabalhos" className="text-sm font-medium text-navy-700 hover:text-teal-600">
              Ver todos
            </Link>
          )}
        </div>

        {myJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Ainda não publicaste nenhum trabalho."
            description="Publica a tua primeira oportunidade e começa a receber candidaturas."
            action={
              <Link href="/trabalhos/publicar">
                <Button size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Publicar primeiro trabalho
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {myJobs.slice(0, 3).map((job) => (
              <Card key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{job.title}</p>
                    <JobStatusBadge status={job.status as JobStatus} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                    <span>{formatBudget(job.budget_min, job.budget_max)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {job.applications_count} candidatura{job.applications_count === 1 ? "" : "s"}
                    </span>
                    <span>{formatRelative(job.created_at)}</span>
                  </div>
                </div>
                <Link href={`/trabalhos/${job.id}`} className="shrink-0">
                  <Button variant="outline" size="sm" fullWidth className="sm:w-auto">
                    Ver trabalho
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trabalhos recomendados para te candidatares */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Trabalhos recomendados para ti</h3>
          <Link href="/trabalhos" className="text-sm font-medium text-navy-700 hover:text-teal-600">
            Ver todos
          </Link>
        </div>

        {recommendedJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Sem trabalhos recomendados por agora"
            description="Volta mais tarde para veres novas oportunidades abertas."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedJobs.map((job) => (
              <RecommendedJobCard
                key={job.id}
                job={job}
                userId={user.id}
                initiallyFavorited={favoritedJobIds.has(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
