import { AdminLayout } from "@/components/admin/AdminLayout";
import { SettingsForm, type SettingsMap } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const metadata = { title: "Configurações — Administração" };
export const dynamic = "force-dynamic";

const defaults: SettingsMap = {
  nome_plataforma: "KaziGo",
  descricao_plataforma: "",
  email_suporte: "",
  telefone_suporte: "",
  comissao_percentagem: "10",
  regras_publicacao: "",
  regras_candidatura: "",
};

export default async function AdminConfiguracoesPage() {
  const { supabase, user, profile } = await requireAdmin();

  const { data: rows } = await supabase.from("platform_settings").select("key, value");

  const settings: SettingsMap = { ...defaults };
  for (const row of rows ?? []) {
    if (row.key in settings) {
      (settings as any)[row.key] = row.value ?? "";
    }
  }

  return (
    <AdminLayout adminName={profile.full_name || profile.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Informações da plataforma, comissão e regras. As alterações ficam ativas imediatamente.
        </p>
      </div>

      <SettingsForm settings={settings} adminId={user.id} />
    </AdminLayout>
  );
}
