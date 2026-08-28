import { redirect } from "next/navigation";
import { FavoritosList } from "@/components/favoritos/FavoritosList";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Favoritos" };
export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/favoritos");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("job_id")
    .eq("user_id", user.id);

  const jobIds = (favorites ?? []).map((f) => f.job_id);

  let jobs: any[] = [];
  if (jobIds.length > 0) {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, category, city, remote, budget_min, budget_max")
      .in("id", jobIds);
    jobs = data ?? [];
  }

  const { data: workerFavorites } = await supabase
    .from("worker_favorites")
    .select("worker_id")
    .eq("user_id", user.id);

  const workerIds = (workerFavorites ?? []).map((f) => f.worker_id);

  let workers: any[] = [];
  if (workerIds.length > 0) {
    const [{ data: profiles }, { data: workerProfiles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, city").in("id", workerIds),
      supabase.from("worker_profiles").select("id, headline, rating, reviews_count").in("id", workerIds),
    ]);

    const wpById = Object.fromEntries((workerProfiles ?? []).map((w) => [w.id, w]));
    workers = (profiles ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      city: p.city,
      headline: wpById[p.id]?.headline ?? null,
      rating: wpById[p.id]?.rating ?? 0,
      reviews_count: wpById[p.id]?.reviews_count ?? 0,
    }));
  }

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Favoritos</h1>
      <FavoritosList userId={user.id} initialJobs={jobs} initialWorkers={workers} />
    </div>
  );
}
