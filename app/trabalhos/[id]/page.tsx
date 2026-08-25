import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Wifi, Users, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { DeleteJobButton } from "@/components/marketplace/DeleteJobButton";
import { ReportButton } from "@/components/marketplace/ReportButton";
import { LeaveReviewButton } from "@/components/marketplace/LeaveReviewButton";
import { CompleteJobButton } from "@/components/marketplace/CompleteJobButton";
import { MessageButton } from "@/components/marketplace/MessageButton";
import { createClient } from "@/lib/supabase/server";
import { ApplyButton } from "./ApplyButton";

export const dynamic = "force-dynamic";

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return "A combinar";
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MTn`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, description, category, city, remote, budget_min, budget_max, applications_count, status, client_id")
    .eq("id", params.id)
    .single();

  if (!job) notFound();

  const { data: client } = await supabase
    .from("profiles")
    .select("full_name, city")
    .eq("id", job.client_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyApplied = false;
  let isFavorited = false;
  if (user) {
    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", job.id)
      .eq("worker_id", user.id)
      .maybeSingle();
    alreadyApplied = !!existing;

    const { data: favorite } = await supabase
      .from("favorites")
      .select("job_id")
      .eq("job_id", job.id)
      .eq("user_id", user.id)
      .maybeSingle();
    isFavorited = !!favorite;
  }

  const isOwner = user?.id === job.client_id;

  // Se o trabalho está concluído, descobre quem é "a outra parte"
  // para permitir deixar avaliação (cliente ↔ trabalhador aceite).
  let reviewTarget: { id: string; name: string } | null = null;
  let alreadyReviewed = false;

  if (user && job.status === "concluido") {
    if (isOwner) {
      const { data: acceptedApp } = await supabase
        .from("job_applications")
        .select("worker_id")
        .eq("job_id", job.id)
        .eq("status", "aceite")
        .maybeSingle();

      if (acceptedApp) {
        const { data: worker } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", acceptedApp.worker_id)
          .single();
        reviewTarget = { id: acceptedApp.worker_id, name: worker?.full_name || "Trabalhador" };
      }
    } else {
      const { data: myAcceptedApp } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("worker_id", user.id)
        .eq("status", "aceite")
        .maybeSingle();

      if (myAcceptedApp) {
        reviewTarget = { id: job.client_id, name: client?.full_name || "Cliente" };
      }
    }

    if (reviewTarget) {
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("job_id", job.id)
        .eq("author_id", user.id)
        .maybeSingle();
      alreadyReviewed = !!existingReview;
    }
  }

  return (
    <div className="container-kazigo max-w-3xl py-10 sm:py-14">
      <Card className="p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{job.title}</h1>
            <p className="mt-1 text-sm text-ink-faint">
              Publicado por {client?.full_name ?? "Cliente"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={job.status === "aberto" ? "success" : "neutral"}>{job.status}</Badge>
            <FavoriteButton jobId={job.id} userId={user?.id ?? null} initiallyFavorited={isFavorited} />
          </div>
        </div>

        {isOwner && (
          <div className="mb-6 flex gap-2 border-b border-border pb-6">
            <Link href={`/trabalhos/${job.id}/editar`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar
              </Button>
            </Link>
            <DeleteJobButton jobId={job.id} />
            {job.status === "em_andamento" && <CompleteJobButton jobId={job.id} />}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
          {job.remote ? (
            <span className="inline-flex items-center gap-1">
              <Wifi className="h-4 w-4" aria-hidden="true" />
              Remoto
            </span>
          ) : job.city ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {job.city}
            </span>
          ) : null}
          <Badge tone="navy">{job.category}</Badge>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            {job.applications_count} candidatura{job.applications_count === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mb-6 border-t border-border pt-6">
          <h2 className="mb-2 text-sm font-semibold text-ink">Descrição</h2>
          <p className="whitespace-pre-line text-sm text-ink-soft">{job.description}</p>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-sm bg-surface-subtle p-4">
          <span className="text-sm text-ink-faint">Orçamento</span>
          <span className="text-lg font-bold text-ink">
            {formatBudget(job.budget_min, job.budget_max)}
          </span>
        </div>

        <ApplyButton
          jobId={job.id}
          jobTitle={job.title}
          clientId={job.client_id}
          alreadyApplied={alreadyApplied}
          isOwnJob={user?.id === job.client_id}
          isLoggedIn={!!user}
        />

        {!isOwner && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <MessageButton otherUserId={job.client_id} jobId={job.id} isLoggedIn={!!user} label="Mensagem ao cliente" />
            <ReportButton
              targetType="job"
              jobId={job.id}
              reportedUserId={job.client_id}
              isLoggedIn={!!user}
              label="Reportar este trabalho"
            />
          </div>
        )}

        {reviewTarget && !alreadyReviewed && user && (
          <div className="mt-4 flex justify-center">
            <LeaveReviewButton
              jobId={job.id}
              authorId={user.id}
              revieweeId={reviewTarget.id}
              revieweeName={reviewTarget.name}
            />
          </div>
        )}
        {reviewTarget && alreadyReviewed && (
          <p className="mt-4 text-center text-xs text-ink-faint">Já avaliaste {reviewTarget.name} neste trabalho.</p>
        )}
      </Card>
    </div>
  );
}
