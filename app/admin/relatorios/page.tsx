import { Users, Briefcase, FileCheck2, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Relatórios — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminRelatoriosPage() {
  const { supabase, profile } = await requireAdmin();

  const [{ data: users }, { data: jobs }, { data: applications }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, role, city, is_suspended, created_at"),
    supabase.from("jobs").select("id, title, category, city, status, applications_count, created_at"),
    supabase.from("job_applications").select("id, job_id, worker_id, status, proposed_price, created_at"),
  ]);

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Relatórios</h1>
        <p className="mt-1 text-sm text-ink-faint">Exporta dados reais da plataforma em CSV.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-3 p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
            <Users className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-ink">Utilizadores</p>
          <p className="text-xs text-ink-faint">Todas as contas registadas</p>
          <ExportCsvButton filename="kazigo-utilizadores.csv" rows={users ?? []} />
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
            <Briefcase className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-ink">Trabalhos</p>
          <p className="text-xs text-ink-faint">Todos os trabalhos publicados</p>
          <ExportCsvButton filename="kazigo-trabalhos.csv" rows={jobs ?? []} />
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
            <FileCheck2 className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-ink">Candidaturas</p>
          <p className="text-xs text-ink-faint">Todas as candidaturas enviadas</p>
          <ExportCsvButton filename="kazigo-candidaturas.csv" rows={applications ?? []} />
        </Card>
      </div>

      <p className="mb-4 text-xs text-ink-faint">
        Filtro por período e exportação PDF ainda não estão disponíveis — dizem-me se precisares e adiciono a
        seguir. Por agora exporta tudo e filtra no Excel/Google Sheets.
      </p>

      <ComingSoonSection
        icon={CreditCard}
        title="Relatórios de pagamentos e denúncias"
        description="Estes só ficam disponíveis quando as respetivas tabelas existirem."
        requiredTable="transactions / reports"
        requiredFields={["Ver secções Pagamentos e Denúncias no menu"]}
      />
    </AdminLayout>
  );
}
