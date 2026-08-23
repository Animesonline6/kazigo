import { AdminLayout } from "@/components/admin/AdminLayout";
import { JobsAdminList, type AdminJob } from "@/components/admin/JobsAdminList";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Trabalhos — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminTrabalhosPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, category, city, remote, status, applications_count, created_at, client_id")
    .order("created_at", { ascending: false });

  const jobsData = jobs ?? [];
  const clientIds = [...new Set(jobsData.map((j) => j.client_id))];

  let clientsById: Record<string, string> = {};
  if (clientIds.length > 0) {
    const { data: clients } = await supabase.from("profiles").select("id, full_name").in("id", clientIds);
    clientsById = Object.fromEntries((clients ?? []).map((c) => [c.id, c.full_name || "Sem nome"]));
  }

  const adminJobs: AdminJob[] = jobsData.map((j) => ({
    id: j.id,
    title: j.title,
    category: j.category,
    city: j.city,
    remote: j.remote,
    status: j.status,
    applications_count: j.applications_count,
    created_at: j.created_at,
    client_name: clientsById[j.client_id] ?? "—",
  }));

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Trabalhos</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {adminJobs.length} trabalho{adminJobs.length === 1 ? "" : "s"} publicado{adminJobs.length === 1 ? "" : "s"} na plataforma.
        </p>
      </div>

      <JobsAdminList jobs={adminJobs} />
    </AdminLayout>
  );
}
