import { notFound } from "next/navigation";
import { MapPin, Star, CheckCircle2, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MessageButton } from "@/components/marketplace/MessageButton";
import { ReportButton } from "@/components/marketplace/ReportButton";
import { FavoriteWorkerButton } from "@/components/marketplace/FavoriteWorkerButton";
import { ReviewsList, type ReviewItem } from "@/components/marketplace/ReviewsList";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", params.id).single();
  return { title: profile?.full_name ? `${profile.full_name} — KaziGo` : "Perfil" };
}

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, city, bio, verified")
    .eq("id", params.id)
    .single();

  if (!profile) notFound();

  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("headline, skills, hourly_rate, rating, reviews_count")
    .eq("id", params.id)
    .single();

  const { data: acceptedApps } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("worker_id", params.id)
    .eq("status", "aceite");

  const jobIds = (acceptedApps ?? []).map((a) => a.job_id);
  let completedCount = 0;
  if (jobIds.length > 0) {
    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .in("id", jobIds)
      .eq("status", "concluido");
    completedCount = count ?? 0;
  }

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("id, rating, comment, author_id, created_at")
    .eq("reviewed_id", params.id)
    .order("created_at", { ascending: false });

  const authorIds = [...new Set((reviewRows ?? []).map((r) => r.author_id))];
  let authorsById: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
  if (authorIds.length > 0) {
    const { data: authors } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", authorIds);
    authorsById = Object.fromEntries((authors ?? []).map((a) => [a.id, a]));
  }

  const reviews: ReviewItem[] = (reviewRows ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    author_name: authorsById[r.author_id]?.full_name || "Utilizador",
    author_avatar: authorsById[r.author_id]?.avatar_url ?? null,
    created_at: r.created_at,
  }));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorited = false;
  if (user && user.id !== params.id) {
    const { data: fav } = await supabase
      .from("worker_favorites")
      .select("worker_id")
      .eq("user_id", user.id)
      .eq("worker_id", params.id)
      .maybeSingle();
    isFavorited = !!fav;
  }

  const skillsList = (workerProfile?.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="container-kazigo max-w-3xl py-10 sm:py-14">
      <Card className="mb-6 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={profile.full_name} src={profile.avatar_url ?? undefined} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-ink sm:text-xl">{profile.full_name}</h1>
                {profile.verified && <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />}
              </div>
              {workerProfile?.headline && <p className="text-sm text-ink-soft">{workerProfile.headline}</p>}
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                {profile.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {profile.city}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
                  {(workerProfile?.rating ?? 0).toFixed(1)} ({workerProfile?.reviews_count ?? 0} avaliações)
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  {completedCount} trabalho{completedCount === 1 ? "" : "s"} concluído{completedCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {user?.id !== params.id && (
            <div className="flex shrink-0 flex-wrap gap-2">
              <MessageButton otherUserId={params.id} isLoggedIn={!!user} label="Mensagem" />
              <FavoriteWorkerButton workerId={params.id} userId={user?.id ?? null} initiallyFavorited={isFavorited} />
            </div>
          )}
        </div>
      </Card>

      {profile.bio && (
        <Card className="mb-6 p-6 sm:p-8">
          <h2 className="mb-2 text-sm font-semibold text-ink">Sobre</h2>
          <p className="text-sm text-ink-soft">{profile.bio}</p>
        </Card>
      )}

      {skillsList.length > 0 && (
        <Card className="mb-6 p-6 sm:p-8">
          <h2 className="mb-3 text-sm font-semibold text-ink">Competências</h2>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <Badge key={skill} tone="navy">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Avaliações</h2>
      </div>
      <ReviewsList reviews={reviews} />

      {user?.id !== params.id && (
        <div className="mt-6 flex justify-center">
          <ReportButton targetType="user" reportedUserId={params.id} isLoggedIn={!!user} label="Reportar este perfil" />
        </div>
      )}
    </div>
  );
}
