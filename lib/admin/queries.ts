import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Queries reutilizáveis para a área administrativa.
// Mantidas fora dos componentes, como pedido: components só
// chamam estas funções e renderizam o resultado.
// ============================================================

export async function getDashboardStats(supabase: SupabaseClient) {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    totalUsers,
    totalJobs,
    activeJobs,
    inProgressJobs,
    completedJobs,
    totalApplications,
    pendingApplications,
    usersThisMonth,
    usersLastMonth,
    jobsThisMonth,
    jobsLastMonth,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "aberto"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "em_andamento"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "concluido"),
    supabase.from("job_applications").select("*", { count: "exact", head: true }),
    supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", startOfThisMonth),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lt("created_at", startOfThisMonth),
    supabase.from("jobs").select("*", { count: "exact", head: true }).gte("created_at", startOfThisMonth),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lt("created_at", startOfThisMonth),
  ]);

  return {
    totalUsers: totalUsers.count ?? 0,
    totalJobs: totalJobs.count ?? 0,
    activeJobs: activeJobs.count ?? 0,
    inProgressJobs: inProgressJobs.count ?? 0,
    completedJobs: completedJobs.count ?? 0,
    totalApplications: totalApplications.count ?? 0,
    pendingApplications: pendingApplications.count ?? 0,
    usersThisMonth: usersThisMonth.count ?? 0,
    usersLastMonth: usersLastMonth.count ?? 0,
    jobsThisMonth: jobsThisMonth.count ?? 0,
    jobsLastMonth: jobsLastMonth.count ?? 0,
  };
}

export type UserRange = "7d" | "30d" | "12m";

/** Série temporal de registos de utilizadores (para o gráfico de utilizadores). */
export async function getUserSignupsSeries(supabase: SupabaseClient, range: UserRange) {
  const now = new Date();
  let from: Date;
  let bucket: "day" | "month" = "day";

  if (range === "7d") {
    from = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    from = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  } else {
    from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    bucket = "month";
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", from.toISOString());

  if (error || !data) return { points: [] as { label: string; value: number }[], error: error?.message };

  const counts = new Map<string, number>();

  for (const row of data) {
    const d = new Date(row.created_at);
    const key =
      bucket === "day"
        ? d.toISOString().slice(0, 10)
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const points: { label: string; value: number }[] = [];
  if (bucket === "day") {
    const days = range === "7d" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      points.push({ label: d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }), value: counts.get(key) ?? 0 });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      points.push({ label: d.toLocaleDateString("pt-PT", { month: "short" }), value: counts.get(key) ?? 0 });
    }
  }

  return { points, error: null };
}

/** Contagem de trabalhos por estado (para o gráfico de trabalhos). */
export async function getJobsByStatus(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("jobs").select("status");
  if (error || !data) return { points: [] as { label: string; value: number }[], error: error?.message };

  const labels: Record<string, string> = {
    aberto: "Publicados",
    em_andamento: "Em andamento",
    concluido: "Concluídos",
    cancelado: "Cancelados",
    pausado: "Pausados",
  };

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }

  const points = Object.entries(labels)
    .map(([key, label]) => ({ label, value: counts[key] ?? 0 }))
    .filter((p) => p.value > 0 || ["aberto", "em_andamento", "concluido", "cancelado"].includes(Object.keys(labels).find((k) => labels[k] === p.label) ?? ""));

  return { points, error: null };
}

/** Contagem de trabalhos por categoria (para o gráfico de categorias). */
export async function getJobsByCategory(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("jobs").select("category");
  if (error || !data) return { points: [] as { label: string; value: number }[], error: error?.message };

  const counts: Record<string, number> = {};
  for (const row of data) {
    const key = row.category || "Outras";
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const points = Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return { points, error: null };
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: string;
  jobsCount: number;
}

/** Lista de categorias reais com contagem de trabalhos associados. */
export async function getCategoriesWithCounts(supabase: SupabaseClient): Promise<CategoryWithCount[]> {
  const [{ data: categories }, { data: jobs }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, active, created_at").order("name"),
    supabase.from("jobs").select("category"),
  ]);

  const counts: Record<string, number> = {};
  for (const j of jobs ?? []) {
    counts[j.category] = (counts[j.category] ?? 0) + 1;
  }

  return (categories ?? []).map((c) => ({ ...c, jobsCount: counts[c.name] ?? 0 }));
}
