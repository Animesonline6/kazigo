import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Wifi, Plus, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import {
  ClientApplicationActions,
  WorkerApplicationWithdraw,
} from "@/components/candidaturas/ApplicationActions";
import { createClient } from "@/lib/supabase/server";
import { MessageButton } from "@/components/marketplace/MessageButton";
import type { ApplicationStatus } from "@/types";

export const metadata = { title: "Candidaturas" };
export const dynamic = "force-dynamic";

const statusTone: Record<ApplicationStatus, "warning" | "success" | "danger" | "neutral"> = {
  pendente: "warning",
  aceite: "success",
  recusada: "danger",
  retirada: "neutral",
};

const statusLabel: Record<ApplicationStatus, string> = {
  pendente: "Pendente",
  aceite: "Aceite",
  recusada: "Recusada",
  retirada: "Retirada",
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

export default async function CandidaturasPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/candidaturas");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  const isWorker = profile.role === "worker";

  // ============================================================
  // TRABALHADOR — candidaturas enviadas
  // ============================================================
  if (isWorker) {
    const { data: applications } = await supabase
      .from("job_applications")
      .select("id, job_id, status, proposed_price, message, created_at")
      .eq("worker_id", user.id)
      .order("created_at", { ascending: false });

    const apps = applications ?? [];
    const jobIds = apps.map((a) => a.job_id);

    let jobsById: Record<string, any> = {};
    if (jobIds.length > 0) {
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, city, remote, category, budget_min, budget_max, client_id")
        .in("id", jobIds);
      jobsById = Object.fromEntries((jobs ?? []).map((j) => [j.id, j]));
    }

    return (
      <div className="container-kazigo py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">As tuas candidaturas</h1>
          <p className="mt-1 text-sm text-ink-faint">Acompanha o estado de todas as tuas candidaturas.</p>
        </div>

        {apps.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Ainda não te candidataste a nenhum trabalho"
            description="Explora os trabalhos disponíveis e envia a tua primeira candidatura."
            action={
              <Link href="/trabalhos">
                <Button size="sm">Explorar trabalhos</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map((app) => {
              const job = jobsById[app.job_id];
              if (!job) return null;
              return (
                <Card key={app.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <Link href={`/trabalhos/${job.id}`} className="text-sm font-semibold text-ink hover:text-navy-700">
                      {job.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                      {job.remote ? (
                        <span className="inline-flex items-center gap-1">
                          <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                          Remoto
                        </span>
                      ) : job.city ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {job.city}
                        </span>
                      ) : null}
                      <span aria-hidden="true">·</span>
                      <span>{formatBudget(job.budget_min, job.budget_max)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelative(app.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone={statusTone[app.status as ApplicationStatus]}>
                      {statusLabel[app.status as ApplicationStatus]}
                    </Badge>
                    <MessageButton otherUserId={job.client_id} jobId={job.id} isLoggedIn label="Mensagem" />
                    {app.status === "pendente" && <WorkerApplicationWithdraw applicationId={app.id} />}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // CLIENTE / EMPRESA — candidaturas recebidas
  // ============================================================
  const { data: myJobs } = await supabase
    .from("jobs")
    .select("id, title, city, remote")
    .eq("client_id", user.id);

  const jobs = myJobs ?? [];
  const jobsById = Object.fromEntries(jobs.map((j) => [j.id, j]));
  const jobIds = jobs.map((j) => j.id);

  let applications: any[] = [];
  let workersById: Record<string, any> = {};

  if (jobIds.length > 0) {
    const { data: apps } = await supabase
      .from("job_applications")
      .select("id, job_id, worker_id, status, message, proposed_price, created_at")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    applications = apps ?? [];

    const workerIds = [...new Set(applications.map((a) => a.worker_id))];
    if (workerIds.length > 0) {
      const { data: workers } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, city")
        .in("id", workerIds);
      workersById = Object.fromEntries((workers ?? []).map((w) => [w.id, w]));
    }
  }

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Candidaturas recebidas</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Analisa e responde às candidaturas dos trabalhos que publicaste.
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Ainda não publicaste nenhum trabalho."
          description="Publica um trabalho para começares a receber candidaturas."
          action={
            <Link href="/trabalhos/publicar">
              <Button size="sm">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Publicar trabalho
              </Button>
            </Link>
          }
        />
      ) : applications.length === 0 ? (
        <EmptyState title="Ainda sem candidaturas" description="Assim que alguém se candidatar a um dos teus trabalhos, aparece aqui." />
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => {
            const job = jobsById[app.job_id];
            const worker = workersById[app.worker_id];
            if (!job || !worker) return null;
            return (
              <Card key={app.id} className="flex flex-col gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={worker.full_name || "Trabalhador"} src={worker.avatar_url ?? undefined} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-ink">{worker.full_name || "Trabalhador"}</p>
                      <Link href={`/trabalhos/${job.id}`} className="text-xs text-ink-faint hover:text-navy-700">
                        candidatou-se a &ldquo;{job.title}&rdquo;
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-faint">{formatRelative(app.created_at)}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone[app.status as ApplicationStatus]}>
                    {statusLabel[app.status as ApplicationStatus]}
                  </Badge>
                </div>

                {app.message && (
                  <p className="rounded-md bg-surface-subtle p-3 text-sm text-ink-soft">{app.message}</p>
                )}

                {app.proposed_price && (
                  <p className="text-sm font-semibold text-ink">
                    Proposta: {app.proposed_price.toLocaleString("pt-PT")} MTn
                  </p>
                )}

                {app.status === "pendente" && (
                  <div className="flex flex-wrap gap-2">
                    <ClientApplicationActions
                      applicationId={app.id}
                      jobId={job.id}
                      jobTitle={job.title}
                      workerId={app.worker_id}
                    />
                    <MessageButton otherUserId={app.worker_id} jobId={job.id} isLoggedIn label="Mensagem" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
