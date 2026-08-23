import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getCategoriesWithCounts } from "@/lib/admin/queries";

export const metadata = { title: "Categorias — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const { supabase, profile } = await requireAdmin();
  const categories = await getCategoriesWithCounts(supabase);

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Categorias</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Cria, edita, ativa/desativa e apaga categorias. Categorias inativas deixam de aparecer no formulário de
          publicar trabalho, mas continuam visíveis nos trabalhos já publicados com elas.
        </p>
      </div>

      <CategoriesManager categories={categories} />
    </AdminLayout>
  );
}
