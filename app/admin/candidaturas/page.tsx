import { AdminLayout } from "@/components/admin/AdminLayout";
import { ApplicationsAdminList, type AdminApplication } from "@/components/admin/ApplicationsAdminList";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Candidaturas — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminCandidaturasPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: applications } = await supabase
    .from("job_applications")
    .select("id, job_id, worker_id, proposed_price, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const apps = applications ?? [];
  const jobIds = [...new Set(apps.map((a) => a.job_id))];
  const workerIds = [...new Set(apps.map((a) => a.worker_id))];

  let jobsById: Record<string, { title: string; client_id: string }> = {};
  if (jobIds.length > 0) {
    const { data: jobs } = await supabase.from("jobs").select("id, title, client_id").in("id", jobIds);
    jobsById = Object.fromEntries((jobs ?? []).map((j) => [j.id, { title: j.title, client_id: j.client_id }]));
  }

  const clientIds = [...new Set(Object.values(jobsById).map((j) => j.client_id))];
  const profileIds = [...new Set([...workerIds, ...clientIds])];

  let profilesById: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", profileIds);
    profilesById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  }

  const adminApplications: AdminApplication[] = apps
    .filter((a) => jobsById[a.job_id])
    .map((a) => {
      const job = jobsById[a.job_id];
      return {
        id: a.id,
        job_id: a.job_id,
        job_title: job.title,
        client_name: profilesById[job.client_id]?.full_name || "—",
        worker_name: profilesById[a.worker_id]?.full_name || "Trabalhador",
        worker_avatar: profilesById[a.worker_id]?.avatar_url ?? null,
        proposed_price: a.proposed_price,
        status: a.status,
        created_at: a.created_at,
      };
    });

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Candidaturas</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {adminApplications.length} candidatura{adminApplications.length === 1 ? "" : "s"} na plataforma (últimas 200).
        </p>
      </div>

      <ApplicationsAdminList applications={adminApplications} />
    </AdminLayout>
  );
}
