import { Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getJobsByCategory } from "@/lib/admin/queries";

export const metadata = { title: "Categorias — Administração" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const { supabase, profile } = await requireAdmin();
  const { points } = await getJobsByCategory(supabase);
  const total = points.reduce((sum, p) => sum + p.value, 0);

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Categorias</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Distribuição real de trabalhos por categoria (calculada a partir dos trabalhos publicados).
        </p>
      </div>

      {points.length === 0 ? (
        <p className="text-sm text-ink-faint">Ainda não há trabalhos publicados suficientes para mostrar categorias.</p>
      ) : (
        <Card className="mb-8 p-5">
          <div className="flex flex-col gap-3">
            {points.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-ink">{p.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${total > 0 ? (p.value / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-semibold text-ink">{p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <Tag className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">Gestão de categorias (criar/editar/desativar)</h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-ink-faint">
            As categorias são hoje texto livre escrito por quem publica o trabalho. Para geri-las de verdade
            (criar, editar, ativar/desativar, ver contagem por categoria oficial), é preciso criar uma tabela{" "}
            <code className="rounded bg-surface-subtle px-1 py-0.5">categories</code> no Supabase (id, nome, ativa)
            e ligar o formulário de publicar trabalho a ela.
          </p>
        </div>
      </Card>
    </AdminLayout>
  );
}
