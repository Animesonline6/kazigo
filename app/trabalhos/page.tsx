import Link from "next/link";
import { Users, MapPin, Wifi, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteButton } from "@/components/marketplace/FavoriteButton";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Trabalhos" };
export const dynamic = "force-dynamic";

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

export default async function TrabalhosPage() {
  const supabase = createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, description, category, city, remote, budget_min, budget_max, applications_count, created_at, status")
    .eq("status", "aberto")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favoritedJobIds = new Set<string>();
  if (user && jobs && jobs.length > 0) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("job_id")
      .eq("user_id", user.id)
      .in("job_id", jobs.map((j) => j.id));
    favoritedJobIds = new Set((favorites ?? []).map((f) => f.job_id));
  }

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Trabalhos disponíveis</h1>
          <p className="mt-1 text-sm text-ink-faint">
            {jobs?.length ?? 0} oportunidade{jobs?.length === 1 ? "" : "s"} em aberto.
          </p>
        </div>
        <Link href="/trabalhos/publicar">
          <Button>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Publicar trabalho
          </Button>
        </Link>
      </div>

      {!jobs || jobs.length === 0 ? (
        <EmptyState
          title="Ainda não há trabalhos publicados"
          description="Sê o primeiro a publicar uma oportunidade na plataforma."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col gap-3 p-5 hover:border-teal-500/60 hover:shadow-elevated">
              <div className="flex items-start justify-between gap-3">
                <a href={`/trabalhos/${job.id}`} className="text-base font-semibold text-ink hover:text-navy-700">
                  {job.title}
                </a>
                <FavoriteButton
                  jobId={job.id}
                  userId={user?.id ?? null}
                  initiallyFavorited={favoritedJobIds.has(job.id)}
                  className="shrink-0"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
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
                <Badge tone="navy">{job.category}</Badge>
              </div>

              <p className="line-clamp-2 text-sm text-ink-soft">{job.description}</p>

              <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold text-ink">
                  {formatBudget(job.budget_min, job.budget_max)}
                </span>
                <div className="flex items-center gap-3 text-xs text-ink-faint">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    {job.applications_count}
                  </span>
                  <span>{formatRelative(job.created_at)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
