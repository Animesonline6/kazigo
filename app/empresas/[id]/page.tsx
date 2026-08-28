import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, CheckCircle2, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { MessageButton } from "@/components/marketplace/MessageButton";
import { ReportButton } from "@/components/marketplace/ReportButton";
import { ReviewsList, type ReviewItem } from "@/components/marketplace/ReviewsList";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = { client: "Cliente", company: "Empresa" };

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", params.id).single();
  return { title: profile?.full_name ? `${profile.full_name} — KaziGo` : "Perfil" };
}

export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, city, bio, verified, role")
    .eq("id", params.id)
    .single();

  if (!profile) notFound();

  let companyInfo: { company_name?: string; sector?: string; bio?: string } | null = null;
  if (profile.role === "company") {
    const { data } = await supabase
      .from("companies")
      .select("company_name, sector, bio")
      .eq("id", params.id)
      .single();
    companyInfo = data;
  }

  const { data: ratingProfile } = await supabase
    .from("worker_profiles")
    .select("rating, reviews_count")
    .eq("id", params.id)
    .single();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, category, created_at")
    .eq("client_id", params.id)
    .eq("approval_status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(6);

  const jobsList = jobs ?? [];
  const publishedCount = jobsList.length;

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

  const displayName = companyInfo?.company_name || profile.full_name;
  const displayBio = companyInfo?.bio || profile.bio;

  return (
    <div className="container-kazigo max-w-3xl py-10 sm:py-14">
      <Card className="mb-6 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={displayName} src={profile.avatar_url ?? undefined} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-ink sm:text-xl">{displayName}</h1>
                {profile.verified && <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />}
              </div>
              <Badge tone="navy">{roleLabel[profile.role] ?? profile.role}</Badge>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                {profile.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {profile.city}
                  </span>
                )}
                {ratingProfile && (ratingProfile.reviews_count ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
                    {ratingProfile.rating.toFixed(1)} ({ratingProfile.reviews_count} avaliações)
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  {publishedCount} trabalho{publishedCount === 1 ? "" : "s"} publicado{publishedCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {user?.id !== params.id && (
            <div className="flex shrink-0">
              <MessageButton otherUserId={params.id} isLoggedIn={!!user} label="Mensagem" />
            </div>
          )}
        </div>
      </Card>

      {displayBio && (
        <Card className="mb-6 p-6 sm:p-8">
          <h2 className="mb-2 text-sm font-semibold text-ink">Sobre</h2>
          <p className="text-sm text-ink-soft">{displayBio}</p>
        </Card>
      )}

      {jobsList.length > 0 && (
        <Card className="mb-6 p-6 sm:p-8">
          <h2 className="mb-3 text-sm font-semibold text-ink">Trabalhos publicados</h2>
          <div className="flex flex-col gap-2">
            {jobsList.map((job) => (
              <Link
                key={job.id}
                href={`/trabalhos/${job.id}`}
                className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:border-teal-500/60"
              >
                <span className="text-ink">{job.title}</span>
                <Badge tone={job.status === "aberto" ? "success" : "neutral"}>{job.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-3 text-sm font-semibold text-ink">Avaliações</div>
      <ReviewsList reviews={reviews} />

      {user?.id !== params.id && (
        <div className="mt-6 flex justify-center">
          <ReportButton targetType="user" reportedUserId={params.id} isLoggedIn={!!user} label="Reportar este perfil" />
        </div>
      )}
    </div>
  );
}
