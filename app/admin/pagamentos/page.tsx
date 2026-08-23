import { CreditCard } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Pagamentos — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminPagamentosPage() {
  const { profile } = await requireAdmin();

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Pagamentos</h1>
        <p className="mt-1 text-sm text-ink-faint">Transações, comissões e reembolsos da plataforma.</p>
      </div>

      <ComingSoonSection
        icon={CreditCard}
        title="Ainda não há pagamentos a mostrar"
        description="Faz parte da Fase 4 do roadmap (PaySuite / M-Pesa / e-Mola), ainda não iniciada. Nada aqui deve ser simulado como se fossem transações reais."
        requiredTable="transactions"
        requiredFields={[
          "id, job_id, payer_id, payee_id",
          "amount, commission, status: pendente / concluido / falhado / reembolsado",
          "payment_method (m-pesa / e-mola / cartão)",
          "created_at",
        ]}
      />
    </AdminLayout>
  );
}
