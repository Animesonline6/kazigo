import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReviewsAdminList, type AdminReview } from "@/components/admin/ReviewsAdminList";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Avaliações — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, job_id, author_id, reviewed_id, rating, comment, created_at")
    .order("created_at", { ascending: false });

  const list = reviews ?? [];
  const peopleIds = [...new Set([...list.map((r) => r.author_id), ...list.map((r) => r.reviewed_id)])];
  const jobIds = [...new Set(list.map((r) => r.job_id))];

  let peopleById: Record<string, string> = {};
  if (peopleIds.length > 0) {
    const { data: people } = await supabase.from("profiles").select("id, full_name").in("id", peopleIds);
    peopleById = Object.fromEntries((people ?? []).map((p) => [p.id, p.full_name || "Sem nome"]));
  }

  let jobsById: Record<string, string> = {};
  if (jobIds.length > 0) {
    const { data: jobs } = await supabase.from("jobs").select("id, title").in("id", jobIds);
    jobsById = Object.fromEntries((jobs ?? []).map((j) => [j.id, j.title]));
  }

  const adminReviews: AdminReview[] = list.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    author_name: peopleById[r.author_id] ?? "—",
    reviewed_name: peopleById[r.reviewed_id] ?? "—",
    job_title: jobsById[r.job_id] ?? "—",
    created_at: r.created_at,
  }));

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Avaliações</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {adminReviews.length} avaliaç{adminReviews.length === 1 ? "ão" : "ões"} na plataforma.
        </p>
      </div>

      <ReviewsAdminList reviews={adminReviews} />
    </AdminLayout>
  );
}
