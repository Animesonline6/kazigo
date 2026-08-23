import { Settings } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Configurações — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const { profile } = await requireAdmin();

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Informações da plataforma, regras, comissões e segurança administrativa.
        </p>
      </div>

      <ComingSoonSection
        icon={Settings}
        title="Ainda não há configurações editáveis"
        description="Hoje estes valores (nome, comissão, regras) estão fixos no código. Para os tornares editáveis aqui sem precisares de mim para cada alteração, é preciso uma tabela de configurações."
        requiredTable="platform_settings"
        requiredFields={[
          "key (ex: comissao_percentagem, nome_plataforma), value",
          "updated_at, updated_by",
        ]}
      />
    </AdminLayout>
  );
}
