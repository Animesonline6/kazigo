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

  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Favoritos</h1>
      <FavoritosList userId={user.id} initialJobs={jobs} />
    </div>
  );
}
