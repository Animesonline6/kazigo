import type { SupabaseClient } from "@supabase/supabase-js";

export interface CategoryWithJobCount {
  id: string;
  name: string;
  slug: string;
  jobsCount: number;
}

/**
 * Categorias ativas (geridas pelo admin) com a contagem real de
 * trabalhos públicos (abertos e aprovados) em cada uma.
 */
export async function getActiveCategoriesWithCounts(supabase: SupabaseClient): Promise<CategoryWithJobCount[]> {
  const [{ data: categories }, { data: jobs }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").eq("active", true).order("name"),
    supabase.from("jobs").select("category").eq("status", "aberto").eq("approval_status", "aprovado"),
  ]);

  const counts: Record<string, number> = {};
  for (const j of jobs ?? []) {
    counts[j.category] = (counts[j.category] ?? 0) + 1;
  }

  return (categories ?? []).map((c) => ({ ...c, jobsCount: counts[c.name] ?? 0 }));
}
