import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReportActions } from "@/components/admin/ReportActions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Flag } from "lucide-react";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Denúncias — Administração" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, "warning" | "success" | "danger" | "neutral"> = {
  pendente: "warning",
  em_analise: "neutral",
  resolvida: "success",
  rejeitada: "danger",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminDenunciasPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, reporter_id, target_type, reported_user_id, job_id, reason, description, status, created_at")
    .order("created_at", { ascending: false });

  const list = reports ?? [];
  const peopleIds = [...new Set([...list.map((r) => r.reporter_id), ...list.map((r) => r.reported_user_id).filter(Boolean)])];
  const jobIds = [...new Set(list.map((r) => r.job_id).filter(Boolean))];

  let peopleById: Record<string, string> = {};
  if (peopleIds.length > 0) {
    const { data: people } = await supabase.from("profiles").select("id, full_name").in("id", peopleIds as string[]);
    peopleById = Object.fromEntries((people ?? []).map((p) => [p.id, p.full_name || "Sem nome"]));
  }

  let jobsById: Record<string, string> = {};
  if (jobIds.length > 0) {
    const { data: jobs } = await supabase.from("jobs").select("id, title").in("id", jobIds as string[]);
    jobsById = Object.fromEntries((jobs ?? []).map((j) => [j.id, j.title]));
  }

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Denúncias</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {list.length} denúncia{list.length === 1 ? "" : "s"} recebida{list.length === 1 ? "" : "s"}.
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Flag} title="Não existem denúncias pendentes." description="Quando alguém reportar um trabalho ou conta, aparece aqui." />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{r.reason}</p>
                  <p className="text-xs text-ink-faint">
                    Denunciado por {peopleById[r.reporter_id] ?? "—"} · {formatDate(r.created_at)}
                  </p>
                  {r.target_type === "job" && r.job_id && (
                    <Link href={`/trabalhos/${r.job_id}`} className="text-xs text-navy-700 hover:underline">
                      Ver trabalho: {jobsById[r.job_id] ?? r.job_id}
                    </Link>
                  )}
                  {r.reported_user_id && (
                    <p className="text-xs text-ink-faint">Conta denunciada: {peopleById[r.reported_user_id] ?? "—"}</p>
                  )}
                </div>
                <Badge tone={statusTone[r.status] ?? "neutral"}>{r.status}</Badge>
              </div>

              {r.description && <p className="rounded-md bg-surface-subtle p-3 text-sm text-ink-soft">{r.description}</p>}

              {r.status === "pendente" || r.status === "em_analise" ? (
                <ReportActions reportId={r.id} reportedUserId={r.reported_user_id} />
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
