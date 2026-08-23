import { Flag } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Denúncias — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminDenunciasPage() {
  const { profile } = await requireAdmin();

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Denúncias</h1>
        <p className="mt-1 text-sm text-ink-faint">Modera contas e trabalhos denunciados por outros utilizadores.</p>
      </div>

      <ComingSoonSection
        icon={Flag}
        title="Ainda não há denúncias a mostrar"
        description="Esta secção precisa de uma tabela de denúncias e de um botão 'Reportar' em algum sítio do site (ainda não existe nenhum)."
        requiredTable="reports"
        requiredFields={[
          "id, reporter_id (quem denunciou), reported_user_id / job_id",
          "reason (motivo), description (descrição)",
          "status: pendente / em_analise / resolvida / rejeitada",
          "created_at",
        ]}
      />
    </AdminLayout>
  );
}
