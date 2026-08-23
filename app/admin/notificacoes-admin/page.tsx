import { Bell } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Notificações — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminNotificacoesPage() {
  const { profile } = await requireAdmin();

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Notificações</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Avisos administrativos: novos utilizadores, novas denúncias, problemas importantes.
        </p>
      </div>

      <ComingSoonSection
        icon={Bell}
        title="Ainda não há notificações administrativas"
        description="Precisa de uma tabela dedicada (diferente das notificações normais de utilizador) para eventos como novas denúncias ou problemas da plataforma."
        requiredTable="admin_notifications"
        requiredFields={[
          "id, type (novo_utilizador / nova_denuncia / pagamento / etc.)",
          "title, description, related_id",
          "read (boolean)",
          "created_at",
        ]}
      />
    </AdminLayout>
  );
}
