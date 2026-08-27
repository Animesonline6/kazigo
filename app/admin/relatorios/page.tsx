import { CreditCard } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReportsPanel } from "@/components/admin/ReportsPanel";
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
        <p className="mt-1 text-sm text-ink-faint">
          Filtra por período e exporta dados reais da plataforma em CSV ou PDF.
        </p>
      </div>

      <ReportsPanel users={users ?? []} jobs={jobs ?? []} applications={applications ?? []} />

      <div className="mt-8">
        <ComingSoonSection
          icon={CreditCard}
          title="Relatórios de pagamentos"
          description="Só fica disponível quando a Fase 4 (pagamentos) estiver ligada a um gateway real."
          requiredTable="transactions"
          requiredFields={["Ver secção Pagamentos no menu"]}
        />
      </div>
    </AdminLayout>
  );
}
