import { Star } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Avaliações — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const { profile } = await requireAdmin();

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Avaliações</h1>
        <p className="mt-1 text-sm text-ink-faint">Modera avaliações deixadas entre clientes e trabalhadores.</p>
      </div>

      <ComingSoonSection
        icon={Star}
        title="Ainda não há avaliações a mostrar"
        description="worker_profiles já tem rating/reviews_count, mas ainda não existe nenhum sítio no site onde um cliente deixe uma avaliação real."
        requiredTable="reviews"
        requiredFields={[
          "id, author_id (quem avalia), reviewed_id (quem é avaliado)",
          "job_id (trabalho relacionado)",
          "rating (1-5), comment",
          "created_at",
        ]}
      />
    </AdminLayout>
  );
}
